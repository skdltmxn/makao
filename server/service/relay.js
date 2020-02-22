// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const BaseService = require('./common/baseservice');

class RelayService extends BaseService {
    constructor(kakaoClient, dbClient) {
        super(kakaoClient);
        this.kakaoClient = kakaoClient;
        this.dbClient = dbClient;

        this.on('service.msg', async msgInfo => {
            if (msgInfo.msgType === 'normal') {
                // check if there is relay rule
                const rules = await this.dbClient.find('relay', {
                    from: msgInfo.chatId,
                });

                rules.forEach(async r => {
                    await this.kakaoClient.sendMsg(r.to, msgInfo.message);
                });
            }
        });
    }
}

module.exports = RelayService;
