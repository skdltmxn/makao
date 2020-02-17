// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;
const net = require('net');
const { LocoPacket, LocoPacketDataTooShort } = require('../packet');

class LocoSocket extends EventEmitter2 {
    constructor(host, port, cryptor) {
        super();
        this.host = host;
        this.port = port;
        this.cryptor = cryptor;
        this.conn = null;
        this.buffer = Buffer.allocUnsafe(0);
    }

    isConnected() {
        return this.conn !== null;
    }

    async connect() {
        this.conn = net.connect(this.port, this.host, async () => {
            this.conn.on('data', data => this.tryParse(data));
        });

        await this.handshake();
    }

    disconnect() {
        if (this.isConnected())
            this.conn.end();
    }

    async write(data) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.isConnected())
                    throw 'not connected';

                resolve(this.conn.write(data));
            } catch (e) {
                reject(e);
            }
        }).catch(err => console.log(`[LocoSocket::write] ${err}`));
    }

    async handshake() {
        const encryptedKey = this.cryptor.encryptAesKey();
        const header = Buffer.allocUnsafe(12);
        header.writeUInt32LE(encryptedKey.length);
        header.writeUInt32LE(12, 4);
        header.writeUInt32LE(2, 8);

        const packet = Buffer.concat([header, encryptedKey]);
        await this.write(packet);
    }

    tryParse(data) {
        try {
            data = Buffer.concat([this.buffer, data]);

            while (true) {
                const len = data.readUInt32LE(0);
                if (data.length < len + 4)
                    throw new LocoPacketDataTooShort(data);

                const iv = data.slice(4, 20);
                const payload = this.cryptor.aesDecrypt(data.slice(20, len + 4), iv);
                const packet = LocoPacket.from(payload);
                
                this.emit('packet', packet);
                data = data.slice(len + 4);
            }
        } catch (e) {
            if (e instanceof LocoPacketDataTooShort) {
                console.log(e);
                this.buffer = Buffer.concat([this.buffer, e.chunk()]);
            }
        }
    }
}

module.exports = LocoSocket;
