// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');

class EchoService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '>');
        this.kakaoClient = kakaoClient;
    }

    description() {
        return '명령어 뒤의 대화를 그대로 출력한다.';
    }

    async onTrigger(msgInfo, args) {
        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            `[${msgInfo.authorNickname}] ${args.join(' ')}`
        );
    }
}

module.exports = EchoService;
