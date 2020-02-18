// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const BaseService = require('./baseservice');

class CommandService extends BaseService {
    constructor(kakaoClient, trigger) {
        super(kakaoClient);

        this.trigger = trigger;
        this.on(`cmd.${trigger}`, async msgInfo => {
            const args = msgInfo.message.split(/\s+/).splice(1);

            try {
                await this.onTrigger(msgInfo, args);
            } catch (e) {
                kakaoClient.sendMsg(
                    msgInfo.chatId,
                    e.message
                );
            }
        })
    }

    serviceTrigger() {
        return this.trigger;
    }
}

module.exports = CommandService;
