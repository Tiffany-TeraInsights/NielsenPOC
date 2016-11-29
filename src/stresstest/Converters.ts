/// <reference path="../typings/index.d.ts" />

export class Converters {

    /**
     * Function to convert strings to binary data
     * 
     * @static
     * @param {string} data
     * @returns {Uint8Array}
     */
    static stringToUint8Array(data: string): Uint8Array {
        return Uint8Array.from(Array.prototype.map.call(data, x => { return x.charCodeAt(0); }))
    }

    /**
     * Function to convert binary data to string 
     * 
     * @static
     * @param {Uint8Array} data
     * @returns {string}
     */
    static Uint8ArrayToString(data: Uint8Array): string {
        return Array.prototype.map.call(data, x => {
            return String.fromCharCode(x);
        }).join('');
    }

    /**
     * Function to convert base64 strings to Uint8Array
     * @data is the string to be converted
     * @returns The raw Uint8Array
     */
    static base64ToUint8Array(data: string): Uint8Array {
        var asStr = Buffer.from(data, 'base64').toString('ascii');
        return Converters.stringToUint8Array(asStr);
    }

    /**
     * Function to convert Uint8Array (raw data) to base64
     * @data The Uint8Array to convert
     * @returns The base64 encoded @data as string
     */
    static Uint8ArrayToBase64(data: Uint8Array): string {
        var encoded = new Buffer(Converters.Uint8ArrayToString(data), 'base64');
        return encoded.toString('ascii');
    }

    /**
     * Function to convert Base64 for Base64URL 
     * 
     * @static
     * @param {string} data
     * @returns {string}
     */
    static base64ToBase64URL(data: string): string {
        return data.split('=')[0].replace(/\+/g, '-').replace(/\//g, '_');
    }

    /**
     * Counterpart function of the above 
     * 
     * @static
     * @param {string} data
     * @returns {string}
     */
    static base64URLToBase64(data: string): string {
        var d = data.replace(/\-/g, '+').replace(/\_/g, '/');
        switch (d.length % 4) {
            case 0: break; // no padding
            case 2: d = d + "=="; break; // 2 char padding
            case 3: d = d + "="; break; // 1 char padding
        }
        return d;
    }

    /**
     * Function to convert from jwt format to a simpler text format.
     * Works for both private and public keys. a
     * 
     * Note 1: Only works correctly for P-256 
     * Note 2: The string representation of the key is base64_x|base64_y
     * NOte 3: The Base64 encoding used by crypto.subtle is non standard. See:
     * http://self-issued.info/docs/draft-goland-json-web-token-00.html#base64urlnotes
     * 
     * @static
     * @param {*} key The key in jwt format
     * @returns {string} String representation of the key. 
     */
    static jwkToString(key: any, pubOnly?: boolean): string {
        if (key.kty !== "EC" || key.crv !== "P-256" || !key.x || !key.y)
            throw new Error("Key type not supported");
        if (key.d && !pubOnly) // private key  
            return [key.x, key.y, key.d].join('|');
        else // public only
            return [key.x, key.y].join('|');
    }

    /**
     * Counterpart of above 
     * 
     * @static
     * @param {string} key
     * @returns {*}
     */
    static stringToJwk(key: string): any {
        var arr = key.split('|');
        if (arr.length < 2 || arr.length > 3)
            throw new Error("Wrong string key representation");
        var ret: any = {
            kty: "EC", crv: "P-256", x: arr[0], y: arr[1],
            key_ops: ['deriveKey']
        }
        if (arr[2]) { // private key
            ret.d = arr[2];
        }
        return ret;
    }

    // Convert a hex string to a byte array
    static hexToBytes(hex: string): Uint8Array {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return new Uint8Array(bytes);
    }

    // Convert a byte array to a hex string
    static bytesToHex(bytes: Uint8Array): string {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
    }

    // Convert a 32-byte integer into a Uint8Array
    static Uint32ToUint8Array(val: number): Uint8Array {
        let arr: ArrayBuffer = new ArrayBuffer(4);
        let view: DataView = new DataView(arr);
        view.setUint32(0, val, false); // littleEndian = false
        return new Uint8Array(arr);
    }

}