// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const BaseClient = require('./baseclient');
const LocoSocket = require('./locosocket');
const Cryptor = require('../cryptor');

class LocoClient extends BaseClient {
    constructor(host, port) {
        const cryptor = new Cryptor();
        const conn = new LocoSocket(host, port, cryptor);
        conn.on('packet', packet => this.emit(packet.method, packet.body));
        super(conn);

        this.cryptor = cryptor;
    }

    async write(data) {
        const header = Buffer.allocUnsafe(4);
        const encrypted = this.cryptor.aesEncrypt(data);
        header.writeUInt32LE(encrypted.length);
        await super.write(Buffer.concat([header, encrypted]));
    }
}

module.exports = LocoClient;
