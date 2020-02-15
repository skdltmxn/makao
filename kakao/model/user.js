// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

class UserInfo {
    constructor(info) {
        this.userId = info.userId;
        this.country = info.countryIso;
        this.accountId = info.accountId;
        this.accessToken = info.access_token;
        this.refreshToken = info.refresh_token;
        this.tokenType = info.token_type;
        this.displayAccountId = info.displayAccountId;
        this.appVersion = info.mainDeviceAppVersion;
    }
}

module.exports = UserInfo;
