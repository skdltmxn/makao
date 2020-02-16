// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;

class BaseClient extends EventEmitter2 {
    constructor(conn) {
        super({ wildcard: true });
        this.conn = conn;
    }

    isConnected() {
        return this.conn !== null;
    }

    async write(data) {
        if (this.isConnected())
            await this.conn.write(data);
    }

    async connect() {
        await this.conn.connect();
    }

    disconnect() {
        if (this.isConnected())
            this.conn.disconnect();
    }
}

module.exports = BaseClient;
