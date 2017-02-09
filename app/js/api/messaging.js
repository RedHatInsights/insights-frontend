'use strict';
var apiModule = require('./');

/**
 * @ngInject
 */
function Messaging($http, InsightsConfig) {
    var root = InsightsConfig.apiRoot;

    function getCampaigns() {
        return $http.get(root + 'messaging/campaigns');
    }

    function saveCampaigns(campaigns) {
        return $http.post(root + 'messaging/users', campaigns);
    }

    function saveOptedIn() {
        return $http.post(root + 'messaging/optin', {autoOptedIn:true});
    }

    return {

        getCampaigns: getCampaigns,
        saveCampaigns: saveCampaigns,
        saveOptedIn: saveOptedIn
    };
}

apiModule.factory('Messaging', Messaging);
