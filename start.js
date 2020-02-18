// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const MakaoServer = require('./server');

(async () => {
    const server = new MakaoServer();
    server.start();
})();
