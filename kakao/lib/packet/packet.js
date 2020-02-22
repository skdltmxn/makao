// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const bson = require('bson');
const { LocoPacketDataTooShort } = require('./error');

class LocoPacket {
    constructor(id, method, body, size) {
        this.id = id
        this.method = method
        this.body = body
        this.size = size
    }

    static from(data) {
        if (data.length < 22) {
            throw new LocoPacketDataTooShort(data);
        }

        const bodyLength = data.readUInt32LE(18);

        if (data.length < 22 + bodyLength) {
            throw new LocoPacketDataTooShort(data);
        }

        const id = data.readUInt32LE(0);
        const method = data.slice(6, 17).toString().replace(/\0/g, '');
        const body = data.slice(22, 22 + bodyLength);

        return new LocoPacket(id, method, bson.deserialize(body), 22 + bodyLength);
    }

    toBuffer() {
        const bsonBody = bson.serialize(this.body);
        const buffer = Buffer.allocUnsafe(22 + bsonBody.length);
        buffer.fill(0, 0, 22);
        buffer.writeUInt32LE(0, 0); // packet ID
        buffer.writeUInt16LE(0, 4); // status
        buffer.write(this.method, 6, 'utf-8');
        buffer.writeUInt8(0, 17);
        buffer.writeUInt32LE(bsonBody.length, 18);
        bsonBody.copy(buffer, 22);

        return buffer;        
    }
}

module.exports = LocoPacket;
