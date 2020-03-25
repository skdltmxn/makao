// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const axios = require('axios');
const moment = require('moment');

class KospiService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, 'ㅋㅅㅍ');
        this.kakaoClient = kakaoClient;
        this.apiEndpoint = 'https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSPI';
    }

    description() {
        return '현재 코스피 현황을 보여준다.';
    }

    async poll() {
        const res = await axios.get(this.apiEndpoint);
        const data = res.data;
        const kospi = data.result.areas[0].datas[0];

        return {
            time: moment(data.result.time).utcOffset(9),
            current: kospi.nv / 100.0,
            delta: kospi.cv / 100.0,
            deltaPercent: kospi.cr,
            highest: kospi.hv / 100.0,
            lowest: kospi.lv / 100.0,
            tradeMoney: kospi.aa,
            tradeStock: kospi.aq,
            market: kospi.ms === 'OPEN' ? '장중' : '장마감',
        };
    }

    async onTrigger(msgInfo, _) {
        const kospi = await this.poll();
        const num = n => Intl.NumberFormat('ko-KR').format(n);
        const signed = n => n >= 0 ? `+${n}` : `-${n}`;

        const msg = `KOSPI (${kospi.time.format('YYYY-MM-DD HH:mm:ss')}) ${kospi.market}\n\n` + 
            `지수: ${num(kospi.current)} ${signed(kospi.delta)} (${signed(kospi.deltaPercent)}%)\n` +
            `장중최고: ${num(kospi.highest)}\n` +
            `장중최저: ${num(kospi.lowest)}\n` +
            `거래량(천주): ${num(kospi.tradeStock)}\n` +
            `거래대금(백만): ${num(kospi.tradeMoney)}`;

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
    }
}

module.exports = KospiService;
