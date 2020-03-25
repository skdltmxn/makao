// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CoinService = require('./coin');
const SummaryService = require('./summary');
const RelayService = require('./relay');
const { KeywordService, KeywordDeleteService, KeywordStorage } = require('./keyword');
const CovidService = require('./covid');
const { DdayStorage, DdayDeleteService, DdayService} = require('./dday');
const FinanceService = require('./finance');
const KospiService = require('./kospi');
const HelpService = require('./help');

class ServiceManager {
    constructor() {
        this.services = [];
    }

    initService(kakaoClient, dbClient) {
        this.services.push(new CoinService(kakaoClient));
        this.services.push(new SummaryService(kakaoClient));
        this.services.push(new RelayService(kakaoClient, dbClient));
        const keywordStorge = new KeywordStorage(dbClient);
        this.services.push(new KeywordService(kakaoClient, keywordStorge));
        this.services.push(new KeywordDeleteService(kakaoClient, keywordStorge));
        this.services.push(new CovidService(kakaoClient));
        const ddayStorage = new DdayStorage(dbClient);
        this.services.push(new DdayDeleteService(kakaoClient, ddayStorage));
        this.services.push(new DdayService(kakaoClient, ddayStorage));
        this.services.push(new FinanceService(kakaoClient));
        this.services.push(new KospiService(kakaoClient));
        this.services.push(new HelpService(kakaoClient, this.services));
    }
}

module.exports = ServiceManager;
