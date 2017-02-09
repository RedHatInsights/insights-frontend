'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function systemMetadataCtrl($scope, System, SystemsService) {
    $scope.loading = false;

    if ($scope.system && $scope.system.system_id) {
        $scope.loading = true;
        System.getSystemMetadata($scope.system.system_id)
        .then(function (metadata) {
            $scope.systemFacts =
              SystemsService.getSystemFacts($scope.system, metadata.data);
            $scope.loading = false;
        });
    }
}

function systemMetadata() {
    return {
        templateUrl: 'js/components/systemMetadata/systemMetadata.html',
        restrict: 'E',
        controller: systemMetadataCtrl,
        scope: {
            system: '='
        }
    };
}

componentsModule.directive('systemMetadata', systemMetadata);
