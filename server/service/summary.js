// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const bson = require('bson');

class SummaryService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '세줄요약');
        this.kakaoClient = kakaoClient;
        this.blacklist = [
            '근데',
            '그래서',
            '그러나',
            '하지만',
            '그래도',
            '그치만',
            '그리고',
            '그런데',
            '그렇지만',
            '그냥',
            '진짜',
            '너무',
            '시발',
            '야발',
            '존나',
            '이거',
            '저거',
            '그거',
            '뭔가',
            '뭐지',
            '많이',
            '따로',
            '같이',
            '여기',
            '저기',
            '거기',
            '내가',
            '너가',
            '그럼',
            '나도',
            '너도',
            '뭐야',
            '아니',
            '시바',
        ];
    }

    description() {
        return '지정한 시간 동안의 대화의 내용을 요약한다. (기본 3시간)';
    }

    isUsable(token) {
        if (token.length < 2) return false;
        if (token[0] === '/') return false;
        if (this.blacklist.includes(token)) return false;
        if (token.match(/^[\u3131-\u314e?\.,!]+$/u)) return false;

        return true;
    }

    async getSummary(msgInfo, since) {
        const DELTA = 8388899092;
        since = bson.Long.fromNumber(msgInfo.logId - (DELTA * 60 * 60 * since));
        const rank = {};

        while (true) {
            const [chatLogs, eof] = await this.kakaoClient.getChatLog([msgInfo.chatId], [since]);

            chatLogs.filter(log => log.type == 'normal' && log.authorId !== this.kakaoClient.userInfo.userId && !log.message.startsWith('/'))
                .forEach(log => {
                    log.message.split(/\s+/).forEach(token => {
                        if (this.isUsable(token)) {
                            if (token in rank) rank[token]++;
                            else rank[token] = 1;
                        }
                    });
                });

            if (eof) break;

            since = chatLogs.pop().logId;
        }

        return rank;
    }

    async onTrigger(msgInfo, args) {
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

        const rank = await this.getSummary(msgInfo, since);
        const summary = Object.keys(rank).sort((a, b) => rank[b] - rank[a]).slice(0, 3);
        const msg = summary.length >= 3
            ? summary.map((s, i) => `${i + 1}. ${s} (${rank[s]}회)`).join('\n')
            : '요약할 내용이 없습니다';

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            `세줄요약 (${since}시간)\n\n${msg}`
        );
    }
}

module.exports = SummaryService;

