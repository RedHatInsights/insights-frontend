/*global require*/
'use strict';

const componentsModule = require('../../');
const MODAL_TEMPLATE =
    'js/components/webhooks/webhookStatusModal/webhookStatusModal.html';

/**
 * @ngInject
 */
function webhookStatusIconCtrl(
    $scope,
    gettextCatalog,
    sweetAlert,
    TemplateService,
    Webhooks) {

    $scope.$watch('webhook', function (webhook) {

        if (!webhook.active) {
            $scope.status = 'gray';
            $scope.tooltip = gettextCatalog.getString('Webhook inactive');
        } else if (webhook.status === null) {
            $scope.status = 'gray';
            $scope.tooltip = gettextCatalog.getString('Unknown - no recent deliveries');
        } else if (webhook.status.success) {
            $scope.status = 'green';
            $scope.tooltip = gettextCatalog.getString('Recent deliveries successful');
        } else {
            $scope.status = 'red';
            const prefix = gettextCatalog.getString('A recent delivery failed');
            $scope.tooltip = `${prefix}: ${webhook.status.error}`;
        }
    }, true);

    $scope.details = function (webhook) {
        return Webhooks.get(webhook.id).then(res => {
            return TemplateService.renderTemplate(MODAL_TEMPLATE, {webhook: res.data});
        }).then(html => {
            return sweetAlert({
                showConfirmButton: false,
                showCancelButton: false,
                type: null,
                title: 'Most Recent Event',
                html
            });
        });
    };
}

function webhookStatusIcon () {
    return {
        scope: {
            webhook: '<'
        },
        templateUrl: 'js/components/webhooks/webhookStatusIcon/webhookStatusIcon.html',
        restrict: 'E',
        replace: true,
        controller: webhookStatusIconCtrl
    };
}

componentsModule.directive('webhookStatusIcon', webhookStatusIcon);
