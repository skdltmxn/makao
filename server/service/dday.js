// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const moment = require('moment');

class DdayStorage {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    async insertDday(chat, name, date) {
        return await this.dbClient.findOneAndUpdate(
            'dday',
            { chat: chat, name: name },
            { $set: { chat: chat, name: name, date: date } },
            { upsert: true }
        );
    }

    async getAllDdays(chat) {
        return await this.dbClient.find('dday', { chat: chat });
    }

    async getDday(chat, name) {
        return await this.dbClient.find('dday', { chat: chat, name: name });
    }

    async deleteDday(chat, name) {
        return await this.dbClient.findOneAndDelete(
            'dday',
            { chat: chat, name: name }
        );
    }
}

class DdayDeleteService extends CommandService {
    constructor(kakaoClient, storage) {
        super(kakaoClient, 'ㄷㅅ');
        this.kakaoClient = kakaoClient;
        this.storage = storage;
    }

    description() {
        return '디데이를 삭제한다.';
    }

    async onTrigger(msgInfo, args) {
        let msg = '';

        if (args.length === 0) {
            msg = '삭제할 디데이를 입력하세요';
        } else {
            const deleted = await this.storage.deleteDday(msgInfo.chatId, args[0]);
            msg = deleted
                ? `디데이 '${deleted.name} (${deleted.date})' 삭제 완료`
                : `없는 디데이 '${args[0]}'`;
        }

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
    }
}

class DdayService extends CommandService {
    constructor(kakaoClient, storage) {
        super(kakaoClient, 'ㄷㄷㅇ');
        this.kakaoClient = kakaoClient;
        this.storage = storage;
    }

    description() {
        return '디데이를 설정하거나 확인한다.';
    }

    getDdayMsg(dday) {
        const today = moment().startOf('day');
        const theDay = moment(dday.date, 'YYYYMMDD');
        const diff = today.diff(theDay, 'days');
        const diffString = diff === 0
            ? '-Day'
            : diff < 0
                ? `-${Math.abs(diff)}`
                : `+${diff}`;

        return `${dday.name} - ${dday.date} (D${diffString})`;
    }

    isDday(dday) {
        const today = moment().startOf('day');
        const theDay = moment(dday.date, 'YYYYMMDD');
        return today.diff(theDay, 'days') === 0;
    }

    async sendDdayAlarms(chatId, days) {
        days.forEach(async d => {
            await this.kakaoClient.sendMsg(
                chatId,
                '☆★☆★☆★경☆★☆★☆★축☆★☆★☆★\n' +
                `오늘은 기다리고 기다리던 '${d.name}'입니다!!\n` +
                '☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★'
            );
        });
    }

    async onTrigger(msgInfo, args) {
        let msg = '';
        let alarmDays = [];

        if (args.length == 0) {
            const allDdays = await this.storage.getAllDdays(msgInfo.chatId);
            const ddayMsg = allDdays.map(dday => this.getDdayMsg(dday)).join('\n');
            alarmDays = allDdays.filter(d => this.isDday(d));

            msg = `디데이 목록\n\n${ddayMsg}`;
        } else if (args.length == 1) {
            const name = args[0];
            const dday = await this.storage.getDday(msgInfo.chatId, name);
            if (this.isDday(dday))
                alarmDays.push(dday);

            msg = dday.length === 0
                ? `없는 디데이 '${name}'`
                : this.getDdayMsg(dday[0]);
        } else {
            const name = args[0];
            const date = moment(args[1], 'YYYYMMDD');
            if (!date.isValid())
                throw new Error('날짜는 YYYYMMDD 형식으로 입력하세요');

            const dateString = date.format('YYYYMMDD');
            const inserted = await this.storage.insertDday(msgInfo.chatId, name, dateString);

            msg = `디데이 등록 [${name} (${dateString})]`;
        }

        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
        await this.sendDdayAlarms(msgInfo.chatId, alarmDays);
    }
}

module.exports = {
    DdayStorage,
    DdayDeleteService,
    DdayService,
};
