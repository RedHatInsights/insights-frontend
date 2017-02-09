'use strict';

var servicesModule = require('./');

function CoercionService() {

    // all the supported langs... pre-lowered
    var supportedLangsMap = {
        en: 'en',
        es: 'es',
        de: 'de',
        it: 'it',
        ko: 'ko',
        fr: 'fr',
        ja: 'ja',
        pt: 'pt',
        zh: 'zh_cn',
        ru: 'ru',
        zh_CN: 'zh_cn'
    };

    return {
        coerce: function (input) {
            if (!input) {
                return 'en';
            }

            let tmp;

            // lower all the things
            input = input.toLowerCase();

            // try a direct map
            if (supportedLangsMap.hasOwnProperty(input)) {
                return supportedLangsMap[input];
            }

            // try the first two chars
            if (input.length > 2) {
                tmp = input.slice(0, 2);
                if (supportedLangsMap.hasOwnProperty(tmp)) {
                    return supportedLangsMap[tmp];
                }
            }

            // I give up
            return 'en';
        }
    };
}

servicesModule.service('CoercionService', CoercionService);
