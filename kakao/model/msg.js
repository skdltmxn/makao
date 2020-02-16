// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const msgType = require('./msgtype');

class MsgInfo {
    constructor(info) {
        this.chatId = info.chatId;
        this.authorNickname = info.authorNickname;
        this.authorId = info.chatLog.authorId;
        this.message = info.chatLog.message;
        this.msgId = info.chatLog.msgId;
        this.logId = info.chatLog.logId;
        this.msgType = msgType[info.chatLog.type] || 'unknown',
        this.attachment = info.chatLog.attachment || null;
    }
}

module.exports = MsgInfo;
