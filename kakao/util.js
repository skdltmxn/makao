// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

require('dotenv').config();
const crypto = require('crypto');
const version = require('./version');

const generateUuid = (userid) => {
    return crypto.createHash('sha512')
        .update(userid)
        .update(process.env.DEVICE_UUID_SEED)
        .digest('base64');
}

const generateXvc = (userid) => {
    const uuid = generateUuid(userid);
    return crypto.createHash('sha512')
        .update(`HEATH|KT/${version} Wd/10.0 ko|DEMIAN|${userid}|${uuid}`)
        .digest('hex')
        .substr(0, 16);
}

module.exports = {
    generateUuid,
    generateXvc,
}