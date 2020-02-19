// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;
const Config = require('../config');
const AccountManager = require('./lib/account');
const Cryptor = require('./lib/cryptor');
const errCodeString = require('./lib/error');
const { UserInfo, MsgInfo } = require('./model');
const BookingClient = require('./booking');
const TicketClient = require('./ticket');
const CarriageClient = require('./carriage');

class KakaoClient extends EventEmitter2 {
    constructor() {
        super();
        this.userid = Config.USER_ID;
        this.accountMgr = new AccountManager(this.userid, Config.PASSWORD);
        this.cryptor = new Cryptor();
        this.userInfo = null;
        this.carriageClient = null;
    }

    async loginCarriage(host, port) {
        const carriageClient = new CarriageClient(host, port, this.userInfo);
        carriageClient.onAny((event, value) => {
            value.method = event;
            //console.log(value);
        });
        //carriageClient.on('LOGINLIST', body => console.log(body));
        carriageClient.on('MSG', async body => {
            const msgInfo = new MsgInfo(body);
            await this.emitAsync('makao.MSG', msgInfo);
        });
        await carriageClient.connect();
        await carriageClient.loginList();
        carriageClient.startPingTimer();

        this.carriageClient = carriageClient;
    }

    async checkIn(host, port) {
        const ticketClient = new TicketClient(host, port, this.userInfo);
        ticketClient.on('CHECKIN', async body => {
            console.log(`carriage server host: ${body.host}:${body.port}`);
            await this.loginCarriage(body.host, body.port);
            ticketClient.disconnect();
        });
        await ticketClient.connect();
        await ticketClient.checkIn();
    }

    async book() {
        const bookClient = new BookingClient();
        bookClient.on('book', async ([host, port]) => {
            await this.checkIn(host, port);
            bookClient.disconnect();
        });
        await bookClient.connect();
        await bookClient.book();
    }

    async login() {
        const res = await this.accountMgr.login();

        if (res.status == 0) {
            console.log(res);
            this.userInfo = new UserInfo(res);
            await this.book();
        } else {
            console.log(errCodeString(res.status));
            switch (res.status) {
                case -100:
                    await this.requestPasscode();
            }
        }

        return res;
    }

    async requestPasscode() {
        const res = await this.accountMgr.requestPasscode();
        console.log(errCodeString(res.status));
        return res;
    }

    async registerDevice(passcode) {
        const res = await this.accountMgr.registerDevice(passcode);
        console.log(errCodeString(res.status));
        return res;
    }

    async sendMsg(chatId, msg) {
        if (!this.carriageClient.isConnected())
            throw new Error('not connected to server');

        await this.carriageClient.sendMsg(chatId, msg);
    }
}

module.exports = KakaoClient;
