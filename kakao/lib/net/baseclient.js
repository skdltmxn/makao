// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter = require('events');

class BaseClient extends EventEmitter {
    constructor(conn) {
        super();
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
