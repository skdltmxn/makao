const Cryptor = require('../kakao/lib/cryptor');
const { LocoSocket } = require('../kakao/lib/net');
const { LocoPacketBuilder } = require('../kakao/lib/packet');

(async () => {
    const host = '27.0.236.160';
    const port = 443;

    const cryptor = new Cryptor();
    const conn = new LocoSocket(host, port, cryptor);
    conn.on('packet', packet => console.log(packet));

    conn.connect();
})();