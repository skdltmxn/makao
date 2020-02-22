// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const BaseClient = require('./baseclient');
const LocoSocket = require('./locosocket');
const Cryptor = require('../cryptor');

class LocoClient extends BaseClient {
    constructor(host, port) {
        const cryptor = new Cryptor();
        const conn = new LocoSocket(host, port, cryptor);
        conn.on('packet', async packet => {
            await this.emitAsync(`req.${packet.id}`, packet.body);
            await this.emitAsync(packet.method, packet.body)
        });
        super(conn);

        this.cryptor = cryptor;
        this.packetId = 0;
    }

    async write(data, callback = null) {
        const header = Buffer.allocUnsafe(4);
        if (callback) {
            this.once(`req.${this.packetId}`, res => callback(res));
        }

        data.writeUInt32LE(this.packetId++, 0);
        const encrypted = this.cryptor.aesEncrypt(data);
        header.writeUInt32LE(encrypted.length);
        await super.write(Buffer.concat([header, encrypted]));
    }
}

module.exports = LocoClient;
