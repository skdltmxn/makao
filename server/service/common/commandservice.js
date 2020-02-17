// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const BaseService = require('./baseservice');

class CommandService extends BaseService {
    constructor(kakaoClient, trigger) {
        super(kakaoClient);

        this.on(`cmd.${trigger}`, msgInfo => {
            const args = msgInfo.message.split(/\s+/).splice(1);
            this.onTrigger(msgInfo, args);
        })
    }
}

module.exports = CommandService;
