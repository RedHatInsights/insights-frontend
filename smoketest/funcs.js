/*global require, module, process*/

// const env     = require('system').env; // because on the container instance process is not global?
const env       = process.env;
const fs        = require('fs');
const Nightmare = require('nightmare');
const crypto    = require('crypto');
const funcs     = {};
const baseUrl   = env.TEST_URL;

funcs.noop = () => {};

funcs.getNightmare = () => {
    const nightmareConf = {
        width: 800,
        height: 900,
        switches: {
            'ignore-certificate-errors': true
        },
        waitTimeout: 20 * 1000,
        show: true
    };

    if (fs.existsSync('/I_AM_A_RUNNER')) {
        console.log('STARTING XVFB');
        new (require('xvfb'))({ silent: true }).startSync();
        nightmareConf.show = false;
    }

    return Nightmare(nightmareConf);
};

funcs.getUrl = (path) => {
    if (!path) { return baseUrl; }
    return baseUrl + path;
};

funcs.getRandomString = (len) => {
    return crypto.randomBytes(len).toString('hex');
};

module.exports = funcs;
