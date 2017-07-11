'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function multiButtonCtrl($scope, MultiButtonService) {

    $scope.oneButtonSelected = false;

    $scope.showDenyClickCursor = function (button) {
        if ($scope.oneButtonSelected && MultiButtonService.getState(button.stateKey)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.getButtonJqueryId = function (button) {
        return '#' + $scope.getButtonId(button) + '.btn';
    };

    $scope.getButtonId = function (button) {
        return 'rha-multibutton-' + button.stateKey;
    };

    $scope.getButtonIconClass = function (button) {
        return button.icon;
    };

    $scope.getButtonClass = function (button) {
        var response = '';
        if ($scope.buttonHasIconClass(button)) {
            response = $scope.getButtonIconClass(button);
        }

        return response;
    };

    $scope.buttonHasIconClass = function (button) {
        if (button.icon) {
            return true;
        } else {
            return false;
        }
    };

    $scope.lastButtonSelected = function (clickedButton) {
        var numSelected = 0;
        var lastButton = null;
        var response = false;

        $scope.buttons.forEach(function (button) {
            if (MultiButtonService.getState(button.stateKey)) {
                lastButton = button;
                numSelected = numSelected + 1;
            }
        });

        if (numSelected === 1 && lastButton && clickedButton) {
            if (clickedButton.stateKey === lastButton.stateKey) {
                response = true;
            }
        }

        return response;
    };

    $scope.toggleButton = function (button) {
        if (!$scope.multiselect && !MultiButtonService.getState(button.stateKey)) {
            $scope.buttons.forEach(function (otherButton) {
                if (otherButton.stateKey !== button.stateKey &&
                    MultiButtonService.getState(otherButton.stateKey)) {

                    jQuery($scope.getButtonJqueryId(otherButton)).button('toggle');
                    MultiButtonService.setState(otherButton.stateKey, false);
                }
            });

            MultiButtonService.setState(button.stateKey, true);
        } else if ($scope.multiselect) {
            if ($scope.allownone || !$scope.lastButtonSelected(button)) {
                MultiButtonService.setState(
                    button.stateKey,
                    !MultiButtonService.getState(button.stateKey));
            } else if ($scope.lastButtonSelected(button)) {
                //unchecked the last button when allownone === false
                //toggle it back to active and don't update MultiButtonService
                jQuery($scope.getButtonJqueryId(button)).button('toggle');
                return;
            }
        }

        if (button.toggleCallback) {
            button.toggleCallback(button.stateKey);
        }
    };
}

function multiButton(MultiButtonService) {
    return {
        templateUrl: 'js/components/multiButton/multiButton.html',
        restrict: 'E',
        replace: false,
        controller: multiButtonCtrl,
        scope: {
            buttons: '=',
            multiselect: '=',
            allownone: '='
        },
        link: function (scope) {
            var getButtonId = function (button) {
                return 'rha-multibutton-' + button.stateKey;
            };

            var getButtonJqueryId = function (button) {
                return '#' + getButtonId(button) + '.btn';
            };

            var setInitialState = function () {
                scope.buttons.forEach(function (button) {
                    if (MultiButtonService.getState(button.stateKey)) {
                        jQuery(getButtonJqueryId(button)).button('toggle');
                    }
                });
            };

            var defer = function () {
                //wait for the buttons to be decorated with jquery methods
                if (jQuery(getButtonJqueryId(scope.buttons[0])).button) {
                    setInitialState();
                } else {
                    window.setTimeout(function () {
                        defer();
                    }, 50);
                }
            };

            //this forces defer to first after dom has loaded
            window.setTimeout(defer, 0);
        }
    };
}

componentsModule.directive('multiButton', multiButton);
