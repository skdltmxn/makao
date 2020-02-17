// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;

class BaseService extends EventEmitter2 {
    constructor(kakaoClient) {
        super({ wildcard: true });

        kakaoClient.on('makao.MSG', msgInfo => {
            if (!msgInfo.message) return;

            // can be a command
            if (msgInfo.message[0] === '/') {
                const args = msgInfo.message.split(/\s+/);
                const verb = args[0].substr(1);

                this.emit(`cmd.${verb}`, msgInfo);
            }
        });

        this.kakaoClient = kakaoClient;
    }
}

module.exports = BaseService;
