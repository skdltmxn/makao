// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const Config = require('../../config');
const axios = require('axios');
const qs = require('querystring');
const { version } = require('../version');
const { generateXvc, generateDeviceUuid } = require('../util');

class AccountManager {
    constructor(userid, password) {
        this.userid = userid;
        this.password = password;
        this.wc = axios.create({
            baseURL: 'https://ac-sb-talk.kakao.com',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Accept-Language': 'ko',
                'A': `win32/${version}/ko`,
                'X-VC': generateXvc(userid),
                'User-Agent': `KT/${version} Wd/10.0 ko`
            }
        });
    }

    async login() {
        const params = qs.stringify({
            'email': this.userid,
            'password': this.password,
            'device_uuid': generateDeviceUuid(),
            'device_name': Config.DEVICE_NAME || 'MY_PC',
            'os_version': '10.0',
            'permanent': 'true',
        });

        const res = await this.wc.post('/win32/account/login.json', params);
        return res.data;
    }

    async requestPasscode() {
        const params = qs.stringify({
            'email': this.userid,
            'password': this.password,
            'device_uuid': generateDeviceUuid(),
            'device_name': Config.DEVICE_NAME || 'MY_PC',
            'permanent': 'true',
        });

        const res = await this.wc.post('/win32/account/request_passcode.json', params);
        return res.data;
    }

    async registerDevice(passcode) {
        const params = qs.stringify({
            'email': this.userid,
            'password': this.password,
            'device_uuid': generateDeviceUuid(),
            'passcode': passcode,
            'device_name': Config.DEVICE_NAME || 'MY_PC',
            'permanent': 'true',
        });

        const res = await this.wc.post('/win32/account/register_device.json', params);
        return res.data;
    }
}

module.exports = AccountManager;
