// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const { LocoClient } = require('./lib/net');
const { LocoPacketBuilder } = require('./lib/packet');
const { version, revision } = require('./version');

class TicketClient extends LocoClient {
    constructor(host, port, userInfo) {
        super(host, port);
        this.userInfo = userInfo;
    }

    async checkIn() {
        const req = new LocoPacketBuilder('CHECKIN')
            .add('userId', this.userInfo.userId)
            .add('os', 'win32')
            .add('ntype', 0)
            .add('appVer', `${version}.${revision}`)
            .add('MCCMNC', '999')
            .add('countryISO', this.userInfo.country)
            .add('useSub', true)
            .add('simMCCMNC', '999')
            .add('lang', 'ko')
            .final();

        await this.write(req);
    }
}

module.exports = TicketClient;
