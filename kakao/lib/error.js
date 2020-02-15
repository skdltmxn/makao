// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

module.exports = (errCode) => {
    switch (errCode) {
        case -100:
            return 'Device not registered';
        default:
            return `Unknown error code: ${errCode}`;
    }
}
