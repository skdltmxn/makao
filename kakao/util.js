// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const Config = require('../config');
const crypto = require('crypto');
const { version } = require('./version');

const generateDeviceUuid = () => {
    return crypto.createHash('sha512')
        .update(Config.DEVICE_UUID_SEED)
        .digest('base64');
}

const generateXvc = (userid) => {
    const uuid = generateDeviceUuid();
    return crypto.createHash('sha512')
        .update(`HEATH|KT/${version} Wd/10.0 ko|DEMIAN|${userid}|${uuid}`)
        .digest('hex')
        .substr(0, 16);
}

module.exports = {
    generateDeviceUuid,
    generateXvc,
}