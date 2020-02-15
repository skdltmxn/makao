// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

require('app-module-path').addPath(__dirname);
const MakaoServer = require('./server');

(async () => {
    const server = new MakaoServer();
    server.start();
})();
