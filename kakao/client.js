// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;
const Config = require('../config');
const AccountManager = require('./lib/account');
const Cryptor = require('./lib/cryptor');
const errCodeString = require('./lib/error');
const { UserInfo, MsgInfo, ChatInfo, ChatLog } = require('./model');
const BookingClient = require('./booking');
const TicketClient = require('./ticket');
const CarriageClient = require('./carriage');
const bson = require('bson');

class KakaoClient extends EventEmitter2 {
    constructor() {
        super();
        this.userid = Config.USER_ID;
        this.accountMgr = new AccountManager(this.userid, Config.PASSWORD);
        this.cryptor = new Cryptor();
        this.userInfo = null;
        this.carriageClient = null;
        this.chatMembers = {};
    }

    async loginCarriage(host, port) {
        const carriageClient = new CarriageClient(host, port, this.userInfo);
        carriageClient.onAny((event, value) => {
            value.method = event;
            //console.log(value);
        });
        carriageClient.on('LOGINLIST', body => {
            body.chatDatas.forEach(async chat => this.chatMembers[chat.c] = await this.getMembers(chat.c));
        });
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

    async getChatMember(chatId, userId) {
        if (!(chatId in this.chatMembers))
            this.chatMembers[chatId] = await this.getMembers(bson.Long.fromNumber(chatId));

        const missed = [];

        userId.forEach(user => {
            if (!(user in this.chatMembers[chatId]))
                missed.push(user);
        });

        // fetch from server
        if (missed.length > 0) {
            const newMembers = await this.getUserInfoFromChat(
                bson.Long.fromNumber(chatId),
                missed.map(bson.Long.fromNumber),
            );

            Object.assign(this.chatMembers[chatId], newMembers);
        }

        return this.chatMembers[chatId];
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

    async getUserInfoFromChat(chatId, memberIds) {
        return new Promise(async (resolve, reject) => {
            if (!this.carriageClient.isConnected())
                return reject('not connected to server');

            try {
                await this.carriageClient.requestMember(chatId, memberIds, res => {
                    const members = {};
                    res.members.forEach(member => members[member.userId] = member.nickName);
                    resolve(members);
                });
            } catch (e) {
                console.log(e);
            }
        }).catch(err => console.log(`[getMembers] ${err}`));
    }

    async getMembers(chatId) {
        return new Promise(async (resolve, reject) => {
            if (!this.carriageClient.isConnected())
                return reject('not connected to server');

            try {
                await this.carriageClient.requestGetMem(chatId, res => {
                    const members = {};
                    res.members.forEach(member => members[member.userId] = member.nickName);
                    resolve(members);
                });
            } catch (e) {
                console.log(e);
            }
        }).catch(err => console.log(`[getMembers] ${err}`));
    }

    async getChatLog(chatIds, sinces) {
        return new Promise(async (resolve, reject) => {
            if (!this.carriageClient.isConnected())
                return reject('not connected to server');

            try {
                await this.carriageClient.requestMchatLogs(chatIds, sinces, res => {
                    const chatLogs = res.chatLogs.map(log => new ChatLog(log))
                    resolve([chatLogs, res.eof]);
                });
            } catch (e) {
                console.log(e);
            }
        }).catch(err => console.log(`[getChatLog] ${err}`));
    }

    async getChatList() {
        return new Promise(async (resolve, reject) => {
            if (!this.carriageClient.isConnected())
                throw new Error('not connected to server');

            try {
                await this.carriageClient.requestLChatList(res => {
                    const chat = [];
                    res.chatDatas.forEach(c => chat.push(new ChatInfo(c)));
                    resolve(chat);
                });
            } catch (e) {
                console.log(e);
            }
        }).catch(err => console.log(`[getChatList] ${err}`));

    }

    async sendMsg(chatId, msg) {
        if (!this.carriageClient.isConnected())
            throw new Error('not connected to server');

        await this.carriageClient.sendMsg(chatId, msg);
    }
}

module.exports = KakaoClient;
