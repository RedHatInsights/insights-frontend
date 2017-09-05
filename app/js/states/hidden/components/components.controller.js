/*global require*/
'use strict';

var statesModule = require('../../');

function ComponentsCtrl(
    $scope,
    $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

    $scope.myDate = new Date();

    $scope.showAlert = function (ev) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('This is the title')
            .textContent('This is the content')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
    };

    $scope.showConfirm = function (ev) {
        $mdDialog.show(
            $mdDialog.confirm()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('This is a title')
            .textContent('This is the content')
            .ariaLabel('Comfirm Dialog Demo')
            .ok('Confirm')
            .cancel('Cancel')
            .targetEvent(ev)
        );
    };

    $scope.onSwipeUp = function () {
        window.alert('You swiped up!!');
    };

}

statesModule.controller('ComponentsCtrl', ComponentsCtrl);
