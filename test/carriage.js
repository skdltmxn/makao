const crypto = require('crypto');
const net = require('net');

const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCAKCAQEApElgRBx+g7sniYFW7LE8ivrwXShKTRFV8lXNItMXbN5QSC8vJ/cT
SOTS619Xv5Zx7xXJIk4EKxtWesEGbgZpEUP2xQ+IeH9oz0JxayEMvvD1nVNAWgpW
E4pociEoArsK7qY3YwXb1CiDHo9hojLv7djbo3cwXvlyMh4TUrX2RjCZPlVJxk/L
Vjzcl9ohJLkl3eoSrf0AE4kQ9mk3+raEhq5Dv+IDxKYX+fIytUWKmrQJusjtre9o
VUX5sBOYZ0dzez/XapusEhUWImmB6mciVXfRXQ8IK4IH6vfNyxMSOTfLEhRYN2SM
LzplAYFiMV536tLS3VmG5GJRdkpDubqPeQIBAw==
-----END RSA PUBLIC KEY-----`;

const makeHandshakePacket = (key) => {
    const encryptedKey = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, key);

    const packet = Buffer.allocUnsafe(12);
    packet.writeUInt32LE(encryptedKey.length);
    packet.writeUInt32LE(12, 4);
    packet.writeUInt32LE(2, 8);

    return Buffer.concat([packet, encryptedKey]);
};

(async () => {
    const key = crypto.randomBytes(16);

    const host = '27.0.236.160';
    const port = 443;

    const conn = net.connect(port, host);
    conn.on('data', data => {
        console.log(data);
    });
    conn.on('end', () => {
        console.log('connection terminated');
    })
    conn.on('error', e => {
        console.log(`error: ${e}`);
    });

    console.log(`sending key ${key.toString('hex')}`)
    conn.write(makeHandshakePacket(key));
})();