const LocoSocket = require('../kakao/lib/net/socket');

(async () => {
    const conn = new LocoSocket('127.0.0.1', 8000);
    conn.connect();
    console.log(conn.isConnected());
    const res = await conn.write('test');
    console.log(res);
})();