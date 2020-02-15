// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const LocoPacket = require('./packet');
const { nextPacketId } = require('./util');

class LocoPacketBuilder {
    constructor(method) {
        this.method = method;
        this.body = {};
    }

    add(key, value) {
        this.body[key] = value;
        return this;
    }

    final() {
        return new LocoPacket(0, this.method, this.body)
            .toBuffer();
    }
}

module.exports = LocoPacketBuilder
