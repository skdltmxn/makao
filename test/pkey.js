const crypto = require('crypto');

const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCAKCAQEApElgRBx+g7sniYFW7LE8ivrwXShKTRFV8lXNItMXbN5QSC8vJ/cT
SOTS619Xv5Zx7xXJIk4EKxtWesEGbgZpEUP2xQ+IeH9oz0JxayEMvvD1nVNAWgpW
E4pociEoArsK7qY3YwXb1CiDHo9hojLv7djbo3cwXvlyMh4TUrX2RjCZPlVJxk/L
Vjzcl9ohJLkl3eoSrf0AE4kQ9mk3+raEhq5Dv+IDxKYX+fIytUWKmrQJusjtre9o
VUX5sBOYZ0dzez/XapusEhUWImmB6mciVXfRXQ8IK4IH6vfNyxMSOTfLEhRYN2SM
LzplAYFiMV536tLS3VmG5GJRdkpDubqPeQIBAw==
-----END RSA PUBLIC KEY-----`;

const withCrypto = () => {
    const enc = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, crypto.randomBytes(32));

    console.log(enc.length);
    console.log(enc);
};

(async () => {
    withCrypto();
})();