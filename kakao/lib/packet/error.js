// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

class LocoPacketDataTooShort extends Error {
    constructor(chunk) {
        super('data too short');
        this.chunk = chunk;
    }

    getChunk() {
        return this.chunk;
    }
}

module.exports = {
    LocoPacketDataTooShort,
}
