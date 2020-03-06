// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const DELTA = 8388899092;
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
        ];
    }

    description() {
        return '지정한 시간 동안의 대화의 내용을 요약한다.';
    }

    isUsable(token) {
        if (token.length < 2) return false;
        if (token[0] === '/') return false;
        if (this.blacklist.includes(token)) return false;
        if (token.match(/^[\u3131-\u314e?\.,!]+$/u)) return false;

        return true;
    }

    async onTrigger(msgInfo, _) {
        let since = bson.Long.fromNumber(msgInfo.logId - (DELTA * 60 * 60 * 3));
        const rank = {};

        while (true) {
            const [chatLogs, eof] = await this.kakaoClient.getChatLog([msgInfo.chatId], [since]);

            chatLogs.filter(log => log.type == 'normal' && log.authorId !== this.kakaoClient.userInfo.userId)
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

        const summary = Object.keys(rank).sort((a, b) => rank[b] - rank[a]).slice(0, 3);
        const msg = summary.length >= 3 
            ? summary.map((s, i) => `${i + 1}. ${s}`).join('\n')
            : '요약할 내용이 없습니다';

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            `세줄요약\n\n${msg}`
        );
    }
}

module.exports = SummaryService;
