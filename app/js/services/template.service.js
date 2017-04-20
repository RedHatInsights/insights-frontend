'use strict';

const servicesModule = require('./');
const assign = require('lodash/assign');

/**
 * Utilities for using angular for rendering / interpolating templates.
 *
 * @ngInject
 */
function TemplateService($compile, $templateCache, $q, $timeout, $rootScope) {
    var service = {};

    service.renderTemplate = function (id, ctx) {
        const scope = $rootScope.$new(true);
        assign(scope, ctx);

        const compiler = $compile($templateCache.get(id));
        const element = compiler(scope);
        const def = $q.defer();

        // rendering is not done until the end of the current digest cycle
        $timeout(function () {
            def.resolve(element.html());
        }, 0);

        return def.promise;
    };

    return service;
}

servicesModule.service('TemplateService', TemplateService);
