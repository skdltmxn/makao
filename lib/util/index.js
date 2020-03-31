// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const anonymize = (nickname) => {
    if (nickname.length > 0) {
        return nickname.slice(0, nickname.length - 1) + '*';
    }

    return nickname;
}

module.exports = {
    anonymize
};
