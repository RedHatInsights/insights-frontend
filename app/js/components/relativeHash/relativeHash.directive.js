'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function relativeHash(PermalinkService) {
    return {
        link: function (scope, element, attrs) {
            if (attrs.href) {
                update(element, attrs.href);
                scope.$watch(function () {
                    return window.location.pathname;
                }, function () {

                    update(element, attrs.href);
                });
            } else {
                asyncUpdate(element, attrs);
            }

            if (attrs.permalink) {
                element.bind('click', function ($ev) {
                    if ($ev.ctrlKey || $ev.metaKey) {
                        return;
                    }

                    $ev.stopPropagation();
                    PermalinkService.make(attrs.href, true);
                });
            }
        }
    };
}

function update(element, href) {
    element[0].href = (window.location.pathname + href);
}

function asyncUpdate(element, attrs) {
    var $unwatch = attrs.$observe('href', function (href) {
        update(element, href);
        $unwatch();
    });
}

componentsModule.directive('relativeHash', relativeHash);
