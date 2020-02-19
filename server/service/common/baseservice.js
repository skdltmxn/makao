// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;

class BaseService extends EventEmitter2 {
    constructor(kakaoClient) {
        super({ wildcard: true });

        kakaoClient.on('makao.MSG', msgInfo => {
            if (!msgInfo.message) return;
            this.emit('service.msg', msgInfo);
        });

        this.kakaoClient = kakaoClient;
    }
}

module.exports = BaseService;
