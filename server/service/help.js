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

    async onTrigger(msgInfo, _) {
        const output = [];
        this.services
            .filter(svc => svc.type === 'command')
            .forEach(svc => output.push(`/${svc.serviceTrigger()}: ${svc.description()}`));

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            output.join('\n')
        );
    }
}

module.exports = HelpService;
