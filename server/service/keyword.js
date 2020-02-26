// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');

class KeywordStorage {
    constructor(dbClient) {
        this.dbClient = dbClient;
        this.cached = {};
        this.init();
    }

    async init() {
        this.cached = await this.getAllKeywords();
    }

    // db access
    async getAllKeywords() {
        const keywords = {};
        const list = await this.dbClient.find('keyword', {});
        list.forEach(item => {
            if (item.chat in keywords)
                keywords[item.chat].push(item);
            else
                keywords[item.chat] = [item];
        });

        return keywords;
    }

    // db access
    async insertKeyword(chat, trigger, word) {
        const document = {
            chat: chat,
            trigger: trigger,
            word: word,
        };
        await this.dbClient.insertOne('keyword', document);

        if (chat in this.cached)
            this.cached[chat].push(document);
        else
            this.cached[chat] = [document];
    }

    // db access
    async deleteKeyword(chat, trigger) {
        const success = await this.dbClient.findOneAndDelete('keyword', {
            chat: chat,
            trigger: trigger,
        });

        if (success) {
            this.cached[chat] = this.cached[chat].filter(item => item.trigger !== trigger);
        }
    }

    findKeyword(chat, trigger) {
        if (chat in this.cached)
            return this.cached[chat].filter(item => item.trigger === trigger);
        else
            return [];
    }

    getAllKeywordsInChat(chat) {
        return chat in this.cached
            ? this.cached[chat]
            : [];
    }
}

class KeywordDeleteService extends CommandService {
    constructor(kakaoClient, storage) {
        super(kakaoClient, 'ㅋㅅ');
        this.kakaoClient = kakaoClient;
        this.storage = storage;
    }

    description() {
        return '키워드를 삭제한다.';
    }

    async onTrigger(msgInfo, args) {
        if (args.length === 0) {
            await this.kakaoClient.sendMsg(msgInfo.chatId, '삭제할 키워드를 입력하세요.');
        } else {
            const trigger = args[0];
            const existing = await this.storage.findKeyword(msgInfo.chatId, trigger);

            if (existing.length === 0) {
                await this.kakaoClient.sendMsg(msgInfo.chatId, `'${trigger}' 없는 키워드`);
            } else {
                await this.storage.deleteKeyword(msgInfo.chatId, trigger);
                await this.kakaoClient.sendMsg(msgInfo.chatId, `'${trigger}' 삭제 완료`);
            }
        }
    }
}

class KeywordService extends CommandService {
    constructor(kakaoClient, storage) {
        super(kakaoClient, 'ㅋㅇㄷ');
        this.kakaoClient = kakaoClient;
        this.storage = storage;
        this.on('service.msg', async msgInfo => {
            this.storage.getAllKeywordsInChat(msgInfo.chatId)
                .filter(item => msgInfo.message.includes(item.trigger))
                .forEach(async item => {
                    await this.kakaoClient.sendMsg(msgInfo.chatId, item.word);
                });
        });
    }

    description() {
        return '키워드를 등록하거나 출력한다.';
    }

    async onTrigger(msgInfo, args) {
        if (args.length == 0) {
            const list = this.storage.getAllKeywordsInChat(msgInfo.chatId)
                .map(k => `${k.trigger} => ${k.word}`).join('\n')

            const msg = '[키워드 목록]\n' + list;
            await this.kakaoClient.sendMsg(msgInfo.chatId, msg.trim());
        } else if (args.length == 1) {
            const trigger = args[0];

            const found = this.storage.findKeyword(msgInfo.chatId, trigger);
            if (found.length > 0) {
                return await this.kakaoClient.sendMsg(
                    msgInfo.chatId,
                    `${trigger} => ${found[0].word}`,
                );
            }

            await this.kakaoClient.sendMsg(
                msgInfo.chatId,
                `'${trigger}' 없는 키워드`,
            );
        } else {
            const trigger = args.shift();
            const word = args.join(' ');
            await this.storage.insertKeyword(msgInfo.chatId, trigger, word);

            await this.kakaoClient.sendMsg(
                msgInfo.chatId,
                `키워드 [${trigger} => ${word}] 추가됨`,
            );
        }
    }
}

module.exports = {
    KeywordService,
    KeywordDeleteService,
    KeywordStorage,
};
