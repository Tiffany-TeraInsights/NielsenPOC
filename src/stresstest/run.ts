import * as config from "config";
import * as crypto from "crypto";
import * as softU2F from "soft-u2f";

import * as httputil from "../app/routes/2Q2R-server"

const device = softU2F.createDevice(),
    baseURL = config.get("2FAserver") as string,
    users = 10,
    auths = 10,
    start = Date.now()

let authsDone = 0

for (let i = 0; i < users; i++) {
    const userID = "user-" + i;
    let keyID: string = undefined;

    httputil.get(`/v1/register/request/${userID}`).then((r: registerSetupReply) => {
        httputil.post("/v1/register/wait", {
            requestID: r.id,
        })

        return httputil.post("/v1/register/challenge", {
            requestID: r.id,
        })
    }).then((r: challengeReply) => {
        return device.register(baseURL, r.challenge, baseURL, userID)
    }).then((r: softU2F.RegistrationResult) => {
        keyID = r.keyID
        return httputil.post("/v1/register", {
            successful: true,
            Data: r.response,
        })
    }).then(() => {
        for (let j = 0; j < auths; j++) {
            const nonce = crypto.randomBytes(20).toString("hex")
            httputil.get(`/v1/auth/request/${userID}/${nonce}`).then((r: authSetupReply) => {
                httputil.post("/v1/auth/wait", {
                    requestID: r.id,
                }).then(() => {
                    authsDone = authsDone + 1
                    if (authsDone == users * auths) {
                        const elapsed = (Date.now() - start) / 1000
                        console.log(`Elapsed time in seconds: ${elapsed}`)
                        console.log(`Number of registrations: ${users}`)
                        console.log(`Total number of authentications: ${users * auths}`)
                        console.log(`Actions per second: ${(users * auths + users) / elapsed}`) 
                    }
                })

                return httputil.post("/v1/auth/challenge", {
                    keyID,
                    requestID: r.id,
                })
            }).then((r: setKeyReply) => {
                return device.authenticate(keyID, baseURL, r.challenge, r.counter)
            }).then((r: softU2F.ISignatureData) => {
                return httputil.post("/v1/auth", {
                    successful: true,
                    data: r,
                })
            })
        }
    })
}

interface registerSetupReply {
    id: string
    registerUrl: string
}

interface challengeReply {
    challenge: string;
}

interface authSetupReply {
    id: string
    authUrl: string
}

interface setKeyReply {
    keyID: string
    challenge: string
    counter: number
    AppID: string
}