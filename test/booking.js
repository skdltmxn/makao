const bson = require('bson');
const tls = require('tls');
const { LocoPacket, LocoPacketBuilder } = require('../kakao/lib/packet');

(async () => {
    const req = new LocoPacketBuilder('GETCONF')
        .add('MCCMNC', '999')
        .add('os', '10.0')
        .add('simMCCMNC', '999')
        .final();

    console.log(req);

    const host = 'booking-loco.kakao.com';
    const port = 443;

    const conn = tls.connect({
        host: host,
        port: port,
        timeout: 0,
    });

    conn.on('data', data => {
        const packet = LocoPacket.from(data);
        //const res = bson.deserialize(data.slice(22));
        console.log(packet);
    });

    conn.on('end', _ => {
        console.log('connection closed');
    });

    conn.write(req);
    conn.end();
})();