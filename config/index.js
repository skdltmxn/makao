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

config.DB_USER = process.env.DB_USER;
config.DB_PASS = process.env.DB_PASS;
config.DB_HOST = process.env.DB_HOST || 'localhost';
config.DB_PORT = process.env.DB_PORT || 27017;
config.DB_NAME = process.env.DB_NAME || 'makao';

config.MAKAO_API_SERVER_PORT = 4000;