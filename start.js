// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const MakaoServer = require('./server');

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

(async () => {
    const server = new MakaoServer();
    await server.init();
    server.start();
})();
