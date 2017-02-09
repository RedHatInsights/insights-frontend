'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function RulePreview($http, $modal) {
    return {
        preview: function (rule) {
            $modal.open({
                templateUrl: 'js/components/system/systemModal/systemModal.html',
                windowClass: 'system-modal ng-animate-enabled',
                backdropClass: 'system-backdrop ng-animate-enabled',
                controller: 'SystemModalCtrl',
                resolve: {
                    rule: function () {
                        return rule;
                    },

                    system: function () {
                        return false;
                    }
                }
            });
        }
    };
}

servicesModule.service('RulePreview', RulePreview);
