'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function TitleService(InsightsConfig) {
    return {
        set: function (newTitle) {
            var defaultTitle = InsightsConfig.title;
            if (newTitle) {
                document.title = newTitle + ' | ' + defaultTitle;
            } else {
                document.title = defaultTitle;
            }
        }
    };
}

servicesModule.service('TitleService', TitleService);
