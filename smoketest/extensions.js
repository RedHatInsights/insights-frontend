/*global require, process, module*/

const lodash = require('lodash');
const el     = require('./elements');

module.exports = (nightmare) => {
    nightmare.waitAndClick = (el) => {
        return nightmare.wait(el).click(el);
    };

    nightmare.wrap = (msg, fn) => {
        console.log(`      - ${msg}`);
        fn(nightmare);
        return nightmare;
    };

    nightmare.waitAll = (base) => {
        const o = lodash.get(el, base);
        if (o) {
            lodash.forOwn(o, function (value) { nightmare.wait(value); });
            return nightmare;
        } else {
            throw new Error('Test Code Error: getting requested base from elements: ' + base);
        }
    };
};

