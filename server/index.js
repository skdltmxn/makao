// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const Config = require('../config');
const express = require('express');
const { KakaoClient } = require('../kakao');
const { ServiceManager } = require('./service');
const { DbClient } = require('../lib/db');

class MakaoServer {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.kakaoClient = new KakaoClient();

        this.dbClient = new DbClient(Config.DB_NAME);
        this.dbClient.connect();

        this.serviceManager = new ServiceManager();
        this.serviceManager.initService(this.kakaoClient, this.dbClient);

        this.app.post('/api/v1/db/insertOne', async (req, res) => {
            try {
                await this.dbClient.insertMany(req.body.collection, [
                    req.body.document
                ]);
                res.json({ success: true });
            } catch (e) {
                res.json({ success: false, error: e.toString() });
            }
        });

        this.app.get('/api/v1/kakao/chatlist', async (_, res) => {
            try {
                await this.kakaoClient.getChatList(list => {
                    res.json({ success: true, chat: list });
                });
            } catch (e) {
                res.json({ success: false, error: e.toString() });
            }
        });

        // this.app.get('/', (_, res) => {
        //     res.send('Hello World');
        // });

        // this.app.get('/login', async (_, res) => {
        //     const loginRes = await this.kakaoClient.login();
        //     res.send(loginRes);
        // });

        // this.app.post('/test', (req, res) => {
        //     console.log(req.body);
        //     res.json({ success: true });
        // });
    }

    start() {
        const port = Config.MAKAO_API_SERVER_PORT;
        this.app.listen(port, async () => {
            await this.kakaoClient.login();
            console.log(`🚀 makao server is listening on ${port}`);
        })
    }
}

module.exports = MakaoServer;
