// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

require('dotenv').config();

const config = module.exports = {};

config.ENV = process.env.MAKAO_ENV === 'live' || 'local';

config.BOOKING_SERVER_HOST = 'booking-loco.kakao.com';
config.BOOKING_SERVER_PORT = 443;

config.DEVICE_UUID_SEED = process.env.DEVICE_UUID_SEED || 'MUST_BE_DEFINED';
config.DEVICE_NAME = process.env.DEVICE_NAME || 'makao';
config.USER_ID = process.env.USER_ID || '';
config.PASSWORD = process.env.PASSWORD || '';

config.MAKAO_API_SERVER_PORT = 4000;