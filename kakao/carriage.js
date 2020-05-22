// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const { LocoClient } = require('./lib/net');
const bson = require('bson');
const { LocoPacketBuilder } = require('./lib/packet');
const { version } = require('./version');
const { generateDeviceUuid } = require('./util');

class CarriageClient extends LocoClient {
    constructor(host, port, userInfo) {
        super(host, port);
        this.userInfo = userInfo;
    }

    async loginList() {
        const req = new LocoPacketBuilder('LOGINLIST')
            .add('prtVer', '1.0')
            .add('appVer', version)
            .add('os', 'win32')
            .add('lang', 'ko')
            .add('oauthToken', this.userInfo.accessToken)
            .add('duuid', generateDeviceUuid())
            .add('ntype', 0)
            .add('MCCMNC', '999')
            .add('dtype', 2)
            .add('pcst', 1)
            .add('chatIds', [])
            .add('maxIds', [])
            .add('lastTokenId', bson.Long.ZERO)
            .add('lbk', 0)
            .add('rp', null)
            .final();

        await this.write(req);
    }

    async requestGetMem(chatId, callback = null) {
        const req = new LocoPacketBuilder('GETMEM')
            .add('chatId', chatId)
            .final();

        await this.write(req, callback);
    }

    async requestMember(chatId, memberIds, callback = null) {
        const req = new LocoPacketBuilder('MEMBER')
            .add('chatId', chatId)
            .add('memberIds', memberIds)
            .final();

        await this.write(req, callback);
    }

    async requestMchatLogs(chatIds, sinces, callback = null) {
        const req = new LocoPacketBuilder('MCHATLOGS')
            .add('chatIds', chatIds)
            .add('sinces', sinces)
            .final();

        await this.write(req, callback);
    }

    async requestLChatList(callback = null) {
        const req = new LocoPacketBuilder('LCHATLIST')
            .add('chatIds', [])
            .add('maxIds', [])
            .add('lastTokenId', bson.Long.ZERO)
            .add('lastChatId', bson.Long.ZERO)
            .add('lbk', 0)
            .final();

        await this.write(req, callback);
    }

    async sendMsg(chatId, msg, type = 1) {
        const req = new LocoPacketBuilder('WRITE')
            .add('chatId', chatId)
            .add('msg', msg)
            .add('msgId', bson.Long.ZERO)
            .add('type', type)
            .final();

        await this.write(req);
    }

    async sendTextMsg(chatId, msg) {
        await this.sendMsg(chatId, msg, 1);
    }

    async sendKakaolink(chatId, data) {
        const req = new LocoPacketBuilder('WRITE')
            .add('chatId', chatId)
            .add('msg', '카카오링크')
            .add('msgId', bson.Long.ZERO)
            .add('type', 71)
            .add('extra', JSON.stringify({
                C: {
                    BUL: [
                        {
                            BU: {
                                HL: true,  // Highlight? 노란색 버튼
                                SR: 'both',
                                T: '당신의 정체는?',
                            },
                            L: {
                                LAA: false,
                                LCA: "kakaotalk://leverage?actionaction=sendtext=sendtext&message=안드충",
                                LCI: "kakaotalk://leverage?actionaction=sendtext=sendtext&message=앱등이",
                                LCM: "kakaotalk://leverage?actionaction=sendtext=sendtext&message=맥충",
                                LCP: "kakaotalk://leverage?actionaction=sendtext=sendtext&message=피카충",
                                LMO: "kakaotalk://leverage?actionaction=sendtext=sendtext&message=모바일",
                                LPC: "kakaotalk://leverage?actionaction=sendtext=sendtext&message=피씨"
                            }
                        }
                    ],
                    BUT: 1, // 버튼 정렬
                    HD: {
                        TD: {
                            D: '',
                            T: '똥통',
                        }
                    },
                    IMT: {
                        THU: 'https://mblogthumb-phinf.pstatic.net/20160315_142/fuckdajk_1458046628921UhuaB_JPEG/1.jpg?type=w800',
                        TD: {
                            T: '봇돌이 테스트',
                            D: '피드 메시지 테스트 중',
                        }
                    },
                    SO: {
                        CM: 1, // comment
                        LK: 99999, // like
                        SH: 3, // share?
                        SB: 4, // 
                        VC: 5, //
                    },
                    TI: {
                        FT: true,
                        L: {
                            LAA: false,
                            LCA: '',
                            LCI: '',
                            LCM: '',
                            LCP: '',
                            LMO: '',
                            LPC: '',
                        },
                        TD: {
                            D: '또 다른 본문',
                            T: '또 다른 제목',
                        }
                    },
                    THC: 0,
                    THL: [],
                },
                P: {
                    VI: '6.4.5',
                    VM: '2.6.1',
                    VW: '2.3.5',
                    AD: false,
                    BT: false,
                    VA: '6.4.5',
                    DID: 'capri_3',
                    FW: false,
                    BC: true,
                    LOCK: false,
                    KV: true,
                    SNM: 'GITHUB',
                    SIC: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                    L: {
                        LAA: false,
                        LCA: '',
                        LCI: '',
                        LCM: '',
                        LCP: '',
                        LMO: '',
                        LPC: '',
                    },
                    ME: '카카오링크',
                    RF: 'chat_bn',
                    SID: 'botdol',
                    SL: {
                        LAA: false,
                        LCA: "https://github.com/skdltmxn/makao",
                        LCI: "https://github.com/skdltmxn/makao",
                        LCM: "https://github.com/skdltmxn/makao",
                        LCP: "https://github.com/skdltmxn/makao",
                        LMO: "https://github.com/skdltmxn/makao",
                        LPC: "https://github.com/skdltmxn/makao"
                    },
                    TP: 'FEED',
                    WT: ''
                }
            }))
            .add('noSeen', false)
            .final();

        await this.write(req);
    }

    startPingTimer() {
        // every 1 min
        setInterval(async () => {
            const req = new LocoPacketBuilder('PING').final();
            await this.write(req);
        }, 60 * 1000);
    }
}

module.exports = CarriageClient;
