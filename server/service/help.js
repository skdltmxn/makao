// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');

class HelpService extends CommandService {
    constructor(kakaoClient, services) {
        super(kakaoClient, '?');
        this.kakaoClient = kakaoClient;
        this.services = services;
    }

    description() {
        return '현재 지원되는 모든 명령어를 출력한다.';
    }

    onTrigger(msgInfo, _) {
        const output = [];
        this.services.forEach(svc => output.push(`/${svc.serviceTrigger()}: ${svc.description()}`));
        this.kakaoClient.sendMsg(
            msgInfo.chatId,
            output.join('\n')
        );
    }
}

module.exports = HelpService;
