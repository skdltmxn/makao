// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const { anonymize } = require('../../lib/util');
const bson = require('bson');

class ShareService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '지분');
        this.kakaoClient = kakaoClient;
    }

    description() {
        return '과거 대화의 지분을 구한다 (기본 3시간).';
    }

    async getShare(msgInfo, since) {
        const DELTA = 8388899092;
        const freqMap = {};
        since = bson.Long.fromNumber(msgInfo.logId - (DELTA * 60 * 60 * since));

        while (true) {
            const [chatLogs, eof] = await this.kakaoClient.getChatLog([msgInfo.chatId], [since]);

            chatLogs.filter(log => log.type == 'normal' && log.authorId !== this.kakaoClient.userInfo.userId)
                .forEach(log => {
                    if (log.authorId in freqMap) freqMap[log.authorId] += log.message !== null ? log.message.length : 0;
                    else freqMap[log.authorId] = log.message !== null ? log.message.length : 0;
                });

            if (eof) break;

            since = chatLogs.pop().logId;
        }

        const total = Object.values(freqMap).reduce((a, b) => a + b, 0) * 1.0;
        const share = {};
        Object.keys(freqMap).forEach(user => {
            share[user] = freqMap[user] / total
        });

        return share;
    }

    async onTrigger(msgInfo, args) {
        try {
            let since = 3;

            if (args.length > 0) {
                const sinceString = args[0];
                if (!isNaN(sinceString) && Number.isInteger(+sinceString)) {
                    since = +sinceString;
                    if (since < 1 || since > 12) {
                        return await this.kakaoClient.sendMsg(
                            msgInfo.chatId,
                            '시간은 1 ~ 12시간까지만 가능합니다.'
                        );
                    }
                } else {
                    return await this.kakaoClient.sendMsg(
                        msgInfo.chatId,
                        '시간은 정수로 입력하세요.'
                    );
                }
            }

            const share = await this.getShare(msgInfo, since);
            const rank = Object.keys(share).sort((a, b) => share[b] - share[a]);
            const members = this.kakaoClient.getChatMembers(msgInfo.chatId);

            let msg = `대화 지분 (${since}시간)\n\n`;
            rank.forEach((user, i) => {
                const rate = share[user] * 100;
                msg += `${i + 1}. ${anonymize(members[user])} - ${rate.toFixed(2)}%\n`;
            });

            await this.kakaoClient.sendMsg(
                msgInfo.chatId,
                msg.trim(),
            );
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = ShareService;
