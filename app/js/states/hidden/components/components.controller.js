/*global require*/
'use strict';

var statesModule = require('../../');

function ComponentsCtrl(
    $scope,
    $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

    $scope.showAlert = function (ev) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('This is an alert title')
            .textContent('Wow!!! Look at this beautiful dialog!!!')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
    };
}

statesModule.controller('ComponentsCtrl', ComponentsCtrl);
