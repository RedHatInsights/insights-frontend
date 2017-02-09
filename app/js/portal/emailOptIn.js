'use strict';

/**
 * @ngInject
 */
function emailUtils(User, System, Messaging) {

    let optedIn = false;

    function optUserIntoCampaigns() {
        if (optedIn) { //This function is only allowed to be called once
            return;
        }

        optedIn = true;
        User.init().then(function (user) {

            if (user.autoOptedIn === false) {
                System.getSystemStatus()
                    .success(function checkSystemCount(status) {
                        if (status.count > 0) {
                            return optUserIn();
                        }
                    });
            }
        });
    }

    function optUserIn() {

        return Messaging.getCampaigns().success(function (campaigns) {
            campaigns.forEach(function (campaign) {
                campaign.enrolled = true;
            });

            return Messaging.saveCampaigns(campaigns).then(function () {
                return Messaging.saveOptedIn();
            });
        });
    }

    return {optUserIntoCampaigns};

}

module.exports = emailUtils;
