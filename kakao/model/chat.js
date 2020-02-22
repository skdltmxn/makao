// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

class ChatInfo {
    constructor(info) {
        this.chatId = info.c;
        this.type = info.t;
        this.total = info.a;
        this.members = info.i.map((userId, i) => [userId, info.k[i]]);
        this.p = info.p;
    }
}

module.exports = ChatInfo;
