// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const Config = require('../config');
const express = require('express');
const { KakaoClient } = require('kakao');

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

        this.app.get('/register/device/:passcode', async (req, res) => {
            const regRes = await this.client.registerDevice(req.params.passcode);
            res.send(regRes);
        });
    }

    start() {
        const port = Config.MAKAO_API_SERVER_PORT;
        this.app.listen(port, async () => {
            console.log(`🚀 makao server is listening on ${port}`);
        })
    }
}

module.exports = MakaoServer;
