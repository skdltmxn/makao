// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const Config = require('../config');
const express = require('express');
const { KakaoClient } = require('kakao');
const { EchoService } = require('./service');

class MakaoServer {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.client = new KakaoClient();
        this.echoService = new EchoService(this.client);

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

        this.app.post('/test', (req, res) => {
            console.log(req.body);
            res.json({success:true});
        });
    }

    start() {
        const port = Config.MAKAO_API_SERVER_PORT;
        this.app.listen(port, () => {
            console.log(`🚀 makao server is listening on ${port}`);
        })
    }
}

module.exports = MakaoServer;
