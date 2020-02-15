// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const tls = require('tls');
const EventEmitter = require('events');
const { LocoPacket, LocoPacketDataTooShort } = require('../packet');

class TlsSocket extends EventEmitter {
    constructor(host, port) {
        super();
        this.host = host;
        this.port = port;
        this.conn = null;
    }

    isConnected() {
        return this.conn !== null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            try {
                this.conn = tls.connect({
                    host: this.host,
                    port: this.port,
                    timeout: 0,
                }, () => {
                    this.conn.on('data', data => {
                        const packet = LocoPacket.from(data);
                        this.emit('packet', packet);
                    });
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        }).catch(err => console.log(`[TlsSocket::connect] ${err}`));

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
        }).catch(err => console.log(`[TlsSocket::write] ${err}`));
    }
}

module.exports = TlsSocket;
