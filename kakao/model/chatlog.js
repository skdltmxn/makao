// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const msgType = require('./msgtype');

class ChatLog {
    constructor(info) {
        this.authorId = info.authorId;
        this.message = info.message;
        this.type = msgType[info.type] || 'unknown';
    }
}

module.exports = ChatLog;
