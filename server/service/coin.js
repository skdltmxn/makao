// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const axios = require('axios');
const WebSocket = require('ws');
const moment = require('moment');

class CoinService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, 'ㅂㅌ');
        this.kakaoClient = kakaoClient;
        this.initCoinTable();
        // this.connectWebsocket();
    }

    async initCoinTable() {
        const res = await axios.get('https://s3.ap-northeast-2.amazonaws.com/crix-production/crix_master');
        this.coinTable = {};
        res.data.forEach(d => this.coinTable[d.code] = d);
    }

    connectWebsocket() {
        // crixTrade - 02
        // crixOrderbook - 03
        // recentCrix - 01
        // shortRecentCrix - 05
        this.ws = new WebSocket('wss://crix-ws.upbit.com/websocket');
        this.ws.on('open', () => this.ws.send(JSON.stringify([
            { ticket: 'ram macbook' },
            { format: 'PRTBUF' },
            // {
            //     type: 'crixTrade',
            //     codes: [
            //         'CRIX.UPBIT.KRW-BTC'
            //     ]
            // },
            // {
            //     type: 'crixOrderbook',
            //     codes: ['CRIX.UPBIT.KRW-BTC']
            // }
            {
                type: 'recentCrix',
                codes: ['CRIX.UPBIT.KRW-BTC']
            }
        ])));
        this.ws.on('message', data => console.log(data.toString('hex')));
    }

    async getCoinInfo(coin) {
        try {
            const res = await axios.get(`https://crix-api-cdn.upbit.com/v1/crix/candles/lines?code=${coin}`);
            return res.data.candles[0];
        } catch (e) {
            throw new Error(`없는 코인 - ${coin.split('-')[1]}`);
        }
    }

    description() {
        return '코인 관련 정보를 확인한다.';
    }

    async onTrigger(msgInfo, args) {
        if (args.length < 1)
            return this.kakaoClient.sendMsg(
                msgInfo.chatId,
                '코인을 입력하세요'
            );

        const coin = args[0].toUpperCase();
        const info = await this.getCoinInfo(`CRIX.UPBIT.KRW-${coin}`);
        const time = moment(info.timestamp);
        const price = Intl.NumberFormat('en-US', { style: 'currency', currency: 'KRW' })
            .format(info.tradePrice);

        const msg = `현재 시세 - ${coin}\n\n` +
            `조회 시간 - ${time.format('YYYY-MM-DD HH:mm:ss')}\n` +
            `현재 가격 - ${price}`;

        this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
    }
}

module.exports = CoinService;
