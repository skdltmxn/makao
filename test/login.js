const { KakaoClient } = require('../kakao');

(async () => {
    const kakao = new KakaoClient();

    await kakao.login();
})();