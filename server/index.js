// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

require('dotenv').config();
const express = require('express');
const { KakaoClient } = require('kakao');
const port = 4000;

class MakaoServer {
    constructor() {
        this.app = express();
        this.client = new KakaoClient();

        this.app.get('/', (_, res) => {
            res.send('Hello World');
        });

        this.app.get('/login', async (_, res) => {
            const loginRes = await this.client.login();
            res.send(loginRes);
        });

        this.app.get('/request/passcode', async (_, res) => {
            const reqRes = await this.client.requestPasscode();
            res.send(reqRes);
        });

        this.app.get('/register/device/:passcode', async (req, res) => {
            const regRes = await this.client.registerDevice(req.params.passcode);
            res.send(regRes);
        });
    }

    start() {
        this.app.listen(port, async () => {
            //await kakao.login(process.env.USER_ID, process.env.PASSWORD);
            console.log(`🚀 makao server is listening on ${port}`);
        })
    }
}

module.exports = MakaoServer;