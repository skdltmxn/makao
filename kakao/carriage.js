// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const { LocoClient } = require('./lib/net');
const bson = require('bson');
const { LocoPacketBuilder } = require('./lib/packet');
const { version } = require('./version');
const { generateDeviceUuid } = require('./util');

class CarriageClient extends LocoClient {
    constructor(host, port, userInfo) {
        super(host, port);
        this.userInfo = userInfo;
    }

    async loginList() {
        const req = new LocoPacketBuilder('LOGINLIST')
            .add('prtVer', '1.0')
            .add('appVer', version)
            .add('os', 'win32')
            .add('lang', 'ko')
            .add('oauthToken', this.userInfo.accessToken)
            .add('duuid', generateDeviceUuid())
            .add('ntype', 0)
            .add('MCCMNC', '999')
            .add('dtype', 2)
            .add('pcst', 1)
            .add('chatIds', [])
            .add('maxIds', [])
            .add('lastTokenId', bson.Long.ZERO)
            .add('lbk', 0)
            .add('rp', null)
            .final();

        await this.write(req);
    }

    async sendMsg(chatId, msg, type) {
        const req = new LocoPacketBuilder('WRITE')
            .add('chatId', chatId)
            .add('msg', msg)
            .add('msgId', bson.Long.ZERO)
            .add('type', type)
            .final();

        await this.write(req);
    }

    async sendTextMsg(chatId, msg) {
        await this.sendMsg(chatId, msg, 1);
    }

    startPingTimer() {
        // every 1 min
        setInterval(async () => {
            const req = new LocoPacketBuilder('PING').final();
            await this.write(req);
        }, 60 * 1000);
    }
}

module.exports = CarriageClient;
