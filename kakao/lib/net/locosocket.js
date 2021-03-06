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
        this.chunk = Buffer.allocUnsafe(0);
    }

    isConnected() {
        return this.conn !== null;
    }

    async connect() {
        this.conn = net.connect(this.port, this.host, async () => {
            this.on('block', this.processBlock);
            this.conn.on('data', chunk => this.decryptChunk(chunk));
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

    decryptChunk(chunk) {
        this.chunk = Buffer.concat([this.chunk, chunk]);
        try {
            while (this.chunk.length > 0) {
                const len = this.chunk.readUInt32LE(0);
                if (this.chunk.length < len + 4)
                    break;

                const iv = this.chunk.slice(4, 20);
                const block = this.cryptor.aesDecrypt(this.chunk.slice(20, len + 4), iv);
                this.buffer = Buffer.concat([this.buffer, block]);
                this.chunk = this.chunk.slice(len + 4);
            }

            this.emit('block');
        } catch (e) {
            console.log(e);
        }
    }

    processBlock() {
        if (this.buffer.length === 0) return;

        try {
            while (this.buffer.length > 0) {
                const packet = LocoPacket.from(this.buffer);
                this.buffer = this.buffer.slice(packet.size);
                this.emit('packet', packet);
            }
        } catch (e) {
            if (!(e instanceof LocoPacketDataTooShort))
                console.log(e);
        }
    }
}

module.exports = LocoSocket;
