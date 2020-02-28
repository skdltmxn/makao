// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const axios = require('axios');

class CovidService extends CommandService {
    constructor(kakaoClient) {
        super(kakaoClient, '코로나');
        this.kakaoClient = kakaoClient;
    }

    description() {
        return '현재 국내 코로나 감염 현황을 보여준다';
    }

    mid(str, left, right, offset = 0) {
        let start = str.indexOf(left, offset);
        if (start < 0) return '';
        start += left.length;

        const end = str.indexOf(right, start);
        if (end < 0) return '';

        return str.substr(start, end - start);
    }

    parseData(data) {
        const date = this.mid(data, '발생 현황(', ')').replace('&nbsp;', ' ');
        const infected = this.mid(data, '<td class="w_bold">', '</td>', data.indexOf('>확진환자<')).replace('&nbsp;', ' ');
        const released = this.mid(data, '<td class="w_bold">', '</td>', data.indexOf('>확진환자 격리해제<')).replace('&nbsp;', ' ');
        const dead = this.mid(data, '<td class="w_bold">', '</td>', data.indexOf('>사망자<')).replace('&nbsp;', ' ');
        const processing = this.mid(data, '<td class="w_bold">', '</td>', data.indexOf('>검사진행<')).replace('&nbsp;', ' ');

        return [date, infected, released, dead, processing];
    }

    async onTrigger(msgInfo, _) {
        const res = await axios.get('http://ncov.mohw.go.kr/bdBoardList_Real.do');
        const status = this.parseData(res.data);
        const msg = `코로나 현황 (${status[0]})\n\n확진자: ${status[1]}\n격리해제: ${status[2]}\n사망자: ${status[3]}\n검사중: ${status[4]}`;
        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
    }
}

module.exports = CovidService;
