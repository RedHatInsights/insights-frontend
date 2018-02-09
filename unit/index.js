/*global require, module, setTimeout*/

require('should-sinon');

const utils = {};

utils.asyncHack = (fn) => {
    setTimeout(fn, 1);
};

module.exports.utils = utils;
