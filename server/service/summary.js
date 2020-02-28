// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const DELTA = 8388899092;
const bson = require('bson');

class SummaryService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '세줄요약');
        this.kakaoClient = kakaoClient;
        this.blacklist = [];
    }

    description() {
        return '지정한 시간 동안의 대화의 내용을 요약한다.';
    }

    filter(token) {
        if (token.length < 2) return false;
        if (token[0] === '/') return false;
        if (token in this.blacklist) return false;
        if (token.match(/^[\u3131-\u314e?\.,!]+$/u)) return false;

        return true;
    }

    async onTrigger(msgInfo, _) {
        const since = bson.Long.fromNumber(msgInfo.logId - (DELTA * 60 * 60 * 3));
        await this.kakaoClient.getChatLog([msgInfo.chatId], [since], async chatLogs => {
            const rank = {};
            chatLogs.filter(log => log.authorId !== this.kakaoClient.userInfo.userId)
                .forEach(log => {
                    log.message.split(/\s+/).filter(token => this.filter(token))
                        .forEach(token => {
                            if (token in rank) rank[token]++;
                            else rank[token] = 1;
                        });
                });

            const summary = Object.keys(rank).sort((a, b) => rank[b] - rank[a]).slice(0, 3);
            const msg = summary.map((s, i) => `${i + 1}. ${s}`).join('\n');

            await this.kakaoClient.sendMsg(
                msgInfo.chatId,
                `세줄요약\n\n${msg}`
            );
        })

    }
}

module.exports = SummaryService;
