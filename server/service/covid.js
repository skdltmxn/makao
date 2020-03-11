// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const CommandService = require('./common/commandservice');
const axios = require('axios');
const html = require('node-html-parser');

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

    extractPureText(node) {
        return node.childNodes.filter(n => n.nodeType == html.NodeType.TEXT_NODE)[0].text
    }

    parseData(data) {
        const root = html.parse(data).querySelector('.liveboard_layout');
        const liveNodeRoot = root.querySelector('.liveNum');

        const date = this.mid(root.querySelector('.livedate').text, '(', ',').replace('&nbsp;', ' ');

        let msg = `코로나 현황 (${date})\n\n`;

        for (const liveNode of liveNodeRoot.querySelectorAll('li')) {
            const title = this.extractPureText(liveNode.querySelector('.tit'));
            const number = this.extractPureText(liveNode.querySelector('.num'));
            const before = this.mid(liveNode.querySelector('.before').text, '(', ')').replace(' ', '');
            msg += `${title}: ${number}명 (${before})\n`;
        }

        return msg.trim();
    }

    async onTrigger(msgInfo, _) {
        const res = await axios.get('http://ncov.mohw.go.kr');
        const msg = this.parseData(res.data);
        await this.kakaoClient.sendMsg(
            msgInfo.chatId,
            msg
        );
    }
}

module.exports = CovidService;
