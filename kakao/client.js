// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

require('dotenv').config();
const AccountManager = require('./lib/account');
const Cryptor = require('./lib/cryptor');
const errCodeString = require('./lib/error');

class KakaoClient {
    constructor() {
        this.userid = process.env.USER_ID;
        this.accountMgr = new AccountManager(this.userid, process.env.PASSWORD);
        this.cryptor = new Cryptor();
    }

    async login() {
        const res = this.accountMgr.login();
        console.log(errCodeString(res.status));
        return res;
    }

    async requestPasscode() {
        const res = this.accountMgr.requestPasscode();
        console.log(errCodeString(res.status));
        return res;
    }

    async registerDevice(passcode) {
        const res = this.accountMgr.registerDevice(passcode);
        console.log(errCodeString(res.status));
        return res;
    }
}

module.exports = KakaoClient;
