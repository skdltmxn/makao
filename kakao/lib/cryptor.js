// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const crypto = require('crypto');

const CipherAlgo = 'aes-128-cfb';
const PublicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCAKCAQEApElgRBx+g7sniYFW7LE8ivrwXShKTRFV8lXNItMXbN5QSC8vJ/cT
SOTS619Xv5Zx7xXJIk4EKxtWesEGbgZpEUP2xQ+IeH9oz0JxayEMvvD1nVNAWgpW
E4pociEoArsK7qY3YwXb1CiDHo9hojLv7djbo3cwXvlyMh4TUrX2RjCZPlVJxk/L
Vjzcl9ohJLkl3eoSrf0AE4kQ9mk3+raEhq5Dv+IDxKYX+fIytUWKmrQJusjtre9o
VUX5sBOYZ0dzez/XapusEhUWImmB6mciVXfRXQ8IK4IH6vfNyxMSOTfLEhRYN2SM
LzplAYFiMV536tLS3VmG5GJRdkpDubqPeQIBAw==
-----END RSA PUBLIC KEY-----`;

class Cryptor {
    constructor() {
        this.key = crypto.randomBytes(16);
    }

    aesEncrypt(data) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(CipherAlgo, this.key, iv);
        return Buffer.concat([iv, cipher.update(data), cipher.final()]);
    }

    aesDecrypt(data, iv) {
        const decipher = crypto.createDecipheriv(CipherAlgo, this.key, iv);
        return Buffer.concat([decipher.update(data), decipher.final()]);
    }

    rsaEncrypt(data) {
        return crypto.publicEncrypt({
            key: PublicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        }, data);
    }

    encryptAesKey() {
        return this.rsaEncrypt(this.key);
    }
}

module.exports = Cryptor;
