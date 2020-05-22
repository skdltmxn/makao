// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');

class KakaolinkService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, 'ㅋㄹ');
        this.kakaoClient = kakaoClient;
    }

    description() {
        return '카카오링크를 생성한다';
    }

    async onTrigger(msgInfo, args) {
        await this.kakaoClient.sendKakaolink(
            msgInfo.chatId,
            true
        );
    }
}

module.exports = KakaolinkService;
