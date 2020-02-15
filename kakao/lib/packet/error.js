// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

class LocoPacketDataTooShort extends Error {
    constructor(message, chunk) {
        super(message);
        this.chunk = chunk;
    }

    chunk() {
        return this.chunk;
    }
}

module.exports = {
    LocoPacketDataTooShort,
}
