// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EchoService = require('./echo');
const CoinService = require('./coin');
const HelpService = require('./help');

class ServiceManager {
    constructor() {
        this.services = [];
    }

    initService(client) {
        this.services.push(new EchoService(client));
        this.services.push(new CoinService(client));
        this.services.push(new HelpService(client, this.services));
    }
}

module.exports = ServiceManager;
