// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EchoService = require('./echo');
const CoinService = require('./coin');
//const SummaryService = require('./summary');
const RelayService = require('./relay');
const HelpService = require('./help');

class ServiceManager {
    constructor() {
        this.services = [];
    }

    initService(kakaoClient, dbClient) {
        this.services.push(new EchoService(kakaoClient));
        this.services.push(new CoinService(kakaoClient));
        //this.services.push(new SummaryService(kakaoClient));
        this.services.push(new RelayService(kakaoClient, dbClient));
        this.services.push(new HelpService(kakaoClient, this.services));
    }
}

module.exports = ServiceManager;
