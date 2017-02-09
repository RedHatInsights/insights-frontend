'use strict';

var componentsModule = require('../../../');

/**
 * @ngInject
 */
function HandcraftedContentDirectiveCtrl($scope, AccountService, OverviewService) {
    $scope.accountNumber = AccountService.number;
    $scope.overview = OverviewService;
}

function handcraftedContent() {
    return {
        templateUrl: 'js/components/overview/widgets/' +
            'handcraftedContent/handcraftedContent.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: HandcraftedContentDirectiveCtrl
    };
}

componentsModule.directive('handcraftedContent', handcraftedContent);
