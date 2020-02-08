const Cryptor = require('../kakao/lib/cryptor');

(async () => {
    const cryptor = new Cryptor();

    const enc = cryptor.aesEncrypt('header.fill(0, 6 + nextPos, 17);');
    const iv = enc.slice(0, 16);
    console.log(enc);
    const dec = cryptor.aesDecrypt(enc.slice(16), iv);
    console.log(dec.toString('utf-8'));
})();