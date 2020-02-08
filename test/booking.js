const bson = require('bson');
const tls = require('tls');

(async () => {
    const bsonReq = bson.serialize({
        MCCMNC: '999',
        os: '10.0',
        simMCCMNC: '999',
    });

    const header = Buffer.allocUnsafe(22);
    header.fill(0, 0, 22);
    header.writeUInt32LE(0, 0); // packet ID
    header.writeUInt16LE(0, 4);
    header.write('GETCONF', 6, 'utf-8');
    header.writeUInt8(0, 17);
    header.writeUInt32LE(bsonReq.length, 18);

    const req = Buffer.allocUnsafe(22 + bsonReq.length);
    header.copy(req);
    bsonReq.copy(req, 22);

    const host = 'booking-loco.kakao.com';
    const port = 443;

    const conn = tls.connect({
        host: host,
        port: port,
        timeout: 0,
    });

    conn.on('data', data => {
        const res = bson.deserialize(data.slice(22));
        console.log(res);
    });

    conn.on('end', _ => {
        console.log('connection closed');
    });

    conn.write(req);
    conn.end();
})();