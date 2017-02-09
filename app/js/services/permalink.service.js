'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function PermalinkService($document, $location, $timeout) {
    var DEFAULTS = {
        offset: 10,
        speed: 300
    };

    function scrollTo(id, offset, speed) {
        if (typeof offset === 'undefined') {
            offset = DEFAULTS.offset;
        }

        if (typeof speed === 'undefined') {
            speed = DEFAULTS.speed;
        }

        $document.scrollTo(document.getElementById(id), offset, speed);
    }

    return {
        make: function (id, scroll, offset, speed) {
            id = id.replace('#', '');
            $location.hash(id);
            if (scroll === true) {
                scrollTo(id, offset, speed);
            }
        },

        scroll: function (id, offset, speed) {
            var hash = $location.hash();

            if (!id) {
                id = hash;
            }

            if (!id) {
                return;
            }

            // Yes, you are reading this right. A timeout in a timeout.
            // Greasy AF but fought with this so much. and this caused the most
            // reliable results.
            $timeout(function () {
                $timeout(function () {
                    scrollTo(id, offset, speed);
                }, 0);
            }, 0);
        }
    };
}

servicesModule.service('PermalinkService', PermalinkService);
