// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const { BaseClient, TlsSocket } = require('./lib/net');
const { LocoPacketBuilder } = require('./lib/packet');

class BookingClient extends BaseClient {
    constructor() {
        const conn = new TlsSocket('booking-loco.kakao.com', 443)
        conn.on('packet', packet => {
            if (packet.method == 'GETCONF') {
                const body = packet.body;
                this.emit('book', [body.ticket.lsl[0], body.wifi.ports[0]]);
            }
        });
        super(conn);
    }

    async book() {
        const req = new LocoPacketBuilder('GETCONF')
            .add('MCCMNC', '999')
            .add('os', '10.0')
            .add('simMCCMNC', '999')
            .final();

        await this.write(req);
    }
}

module.exports = BookingClient;
