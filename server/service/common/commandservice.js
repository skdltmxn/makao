// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const BaseService = require('./baseservice');

class CommandService extends BaseService {
    constructor(kakaoClient, trigger) {
        super(kakaoClient, 'command');

        this.trigger = trigger;

        this.on(`cmd.${trigger}`, async (msgInfo, args) => {
            try {
                await this.onTrigger(msgInfo, args.splice(1));
            } catch (e) {
                kakaoClient.sendMsg(
                    msgInfo.chatId,
                    e.message
                );
            }
        });

        this.on('service.msg', msgInfo => {
            // can be a command
            if (msgInfo.message[0] === '/') {
                const args = msgInfo.message.trim().split(/\s+/);
                const verb = args[0].substr(1);

                this.emit(`cmd.${verb}`, msgInfo, args);
            }
        });
    }

    serviceTrigger() {
        return this.trigger;
    }
}

module.exports = CommandService;
