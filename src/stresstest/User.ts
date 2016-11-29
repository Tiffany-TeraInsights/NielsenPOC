import * as httputil from "../app/routes/2Q2R-server"
import * as crypto from "crypto";
const EC = require("elliptic").ec;

import { ECKeyPair } from "./elliptic.d";
import { Converters } from "./Converters";

interface IRegisterData {
    clientData: string; // serialized client data JSON
    registrationData: string; // websafe-base64-encoded U2F registration binary
}

interface RegistrationResult {
    keyID: string,
    response: IRegisterData
}

/**
 * Performs a full U2F registration, generating and caching a keypair, then preparing
 * a response and signing it using the newly produced private key.
 * 
 * @param   {string}  appID       The websafe-base64-encoded, 32-byte ID of the application to register with.
 * @param   {string}  challenge   A base64-encoded, 32-byte challenge generated by the server.
 * @param   {string}  baseURL     The application host domain to register with.
 * @param   {string}  userID      The username for the account the key is registering to on the server.
 * @returns A Promise which succeeds with a properly packaged registration response
 *          or fails with an error due to a bad parameter or a missing key.
 */
function register(appID: string, challenge: string, baseURL: string, userID: string): RegistrationResult {
    const key: ECKeyPair = new EC("p256").ec.genKeyPair()

    let h = crypto.createHash("sha256")
    h.update(appID)
    const hashedAppID = h.digest('utf-8' as crypto.HexBase64Latin1Encoding)

    const clientData = `{"type":"navigator.id.finishEnrollment","challenge"` + 
        `:"${challenge}","origin":"${baseURL}"}`
    h = crypto.createHash("sha256")
    h.update(clientData)
    const hashedClientData = h.digest('utf-8' as crypto.HexBase64Latin1Encoding)

    const pub = key.getPublic("hex");
    const pubBytes = Converters.hexToBytes(pub);

    // Manually assemble the attestation certificate (X.509 DER)
    const cert = [0x30, 0x81, 0xc5, 0x30, 0x81, 0xb1, 0xa0, 0x03, 0x02,
        0x01, 0x02, 0x02, 0x01, 0x01, 0x30, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48,
        0xce, 0x3d, 0x04, 0x03, 0x02, 0x30, 0x0f, 0x31, 0x0d, 0x30, 0x0b, 0x06,
        0x03, 0x55, 0x04, 0x03, 0x13, 0x04, 0x66, 0x61, 0x6b, 0x65, 0x30,
        0x1e, 0x17, 0x0d, 0x37, 0x30, 0x30, 0x31, 0x30, 0x31, 0x30, 0x30, 0x30,
        0x30, 0x30, 0x30, 0x5a, 0x17, 0x0d, 0x34, 0x38, 0x30, 0x31, 0x30, 0x31,
        0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x5a, 0x30, 0x0f, 0x31, 0x0d, 0x30,
        0x0b, 0x06, 0x03, 0x55, 0x04, 0x03, 0x13, 0x04, 0x66, 0x61, 0x6b, 0x65,
        0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
        0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x03,
        0x42, 0x00];
    cert.concat([].slice.call(pub))
    cert.concat([0x30, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d,
        0x04, 0x03, 0x02, 0x03, 0x03, 0x00, 0x30, 0x00])

    h = crypto.createHash("sha256");
    const handle = crypto.randomBytes(16)
    let toSign = Buffer.alloc(1 + 32 + 32 + handle.length + 65)
    toSign.set([0x00]); // byte reserved for future use
    toSign.set(new Buffer(hashedAppID), 1);  // application parameter
    toSign.set(new Buffer(hashedClientData), 33); // challenge parameter
    toSign.set(handle, 65); // key handle
    toSign.set(pubBytes, 65 + handle.length); // public key
    h.update(toSign)

    let signed = key.sign(h.digest()).toDER()
    let reg = new Uint8Array(1 + pub.length + 1 + handle.length +
        cert.length + signed.length)

    reg.set(0, 0x05)
    reg.set(pubBytes, 1)
    reg.set(66, handle.length)
    reg.set(handle, 67)
    reg.set(new Uint8Array(cert), 67 + handle.length)
    reg.set(signed, 267 + handle.length)

    return {
        keyID: Converters.Uint8ArrayToBase64(handle),
        response: {
            clientData: clientData,
            registrationData: Converters.base64ToBase64URL(Converters.Uint8ArrayToBase64(reg))
        }
    }
}

interface registerSetupReply {
    id: string
    registerUrl: string
}

interface challengeReply {
    challenge: string;
}

export default class User {
    requestID: string

    constructor(userID: string) {
        httputil.get("/v1/register/request/" + userID)
            .then((r: registerSetupReply) => {
                this.requestID = r.id

                httputil.post("/v1/register/wait", {
                    requestID: this.requestID,
                }).then(this.waitThenAuthenticate)
                .catch((e: Error) => {
                    throw e
                })
                
                // Get the challenge then register using the soft-u2f library
                httputil.post("/v1/register/challenge", {
                    requestID: this.requestID,
                }).then((r: challengeReply) => {
                    console.log(`challenge = ${r.challenge}`);
                    
                })
            }).catch((e: any) => {
            throw new Error(`Got error: e`)
        });
    }
}