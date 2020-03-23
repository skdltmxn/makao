// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const axios = require('axios');
const moment = require('moment');

class FinanceService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '증시');
        this.kakaoClient = kakaoClient;
        this.apiEndpoint = 'https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:';
    }

    description() {
        return '현재 국내 증시 현황을 보여준다.';
    }

    async poll() {
        const codes = {
            KOSPI: '코스피',
            KOSDAQ: '코스닥',
            FUT: '선물',
            KPI200: '코스피200',
        };
        const url = this.apiEndpoint + Object.keys(codes).join(',');
        const res = await axios.get(url);
        const data = res.data;
        const result = {
            time: moment(data.result.time).utcOffset(9),
            entries: []
        };
        data.result.areas[0].datas.forEach(data => result.entries.push({
            code: codes[data.cd],
            current: data.nv / 100.0,
            delta: data.cv / 100.0,
            deltaPercent: data.cr,
            market: data.ms === 'OPEN' ? '장중' : '장마감',
        }));

        return result;
    }

    async onTrigger(msgInfo, args) {
        const result = await this.poll();
        const msg = `현재 국내 증시 (${result.time.format('YYYY-MM-DD HH:mm:ss')})\n\n` + 
            result.entries.map(entry => `${entry.code}: ${entry.current} ${entry.delta} (${entry.deltaPercent}%) ${entry.market}`)
            .join('\n');

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
    }
}

module.exports = FinanceService;
