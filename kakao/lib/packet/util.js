// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

let __nextPacketId__ = 0;
const nextPacketId = () => {
    return __nextPacketId__++;
}

module.exports = {
    nextPacketId,
}
