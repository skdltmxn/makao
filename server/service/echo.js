// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');

class EchoService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '에코');
        this.kakaoClient = kakaoClient;
    }

    onTrigger(msgInfo, args) {
        console.log(args);
        this.kakaoClient.sendMsg(
            msgInfo.chatId,
            `[${msgInfo.authorNickname}] ${args.join(' ')}`
        );
    }
}

module.exports = EchoService;
