/*global require*/
'use strict';

const componentsModule = require('../');

/**
 * @ngInject
 */
function RenameableProperty($document, $scope, $timeout, $window, ModalUtils) {

    function initPropertyName () {
        $scope.edit.name = $scope.value;
    }

    $scope.edit = {
        value: false
    };

    initPropertyName();

    $scope.rename = function () {
        const cancel = bindEvalAsync(function () {
            initPropertyName();
            close();
        });

        $scope.submit = bindEvalAsync(function ($event) {
            if ($event.type === 'click' && (
                $event.target.id === 'edit-toggle' ||
                $event.target.id === 'renameable-property-input' ||
                $scope.edit.value === 'frozen')) {
                return;
            }

            const name = (!$scope.edit.name || !$scope.edit.name.length) ?
                null : $scope.edit.name;

            if (name === $scope.value || (!name && !$scope.allowNull)) {
                return cancel();
            }

            $scope.edit.value = 'frozen';

            $scope.updateFunction({newValue: name}).then(function () {
                $scope.value = name;
                initPropertyName();
                close();

            }).catch(function () {
                initPropertyName();
                close();
            });
        });

        $scope.edit.value = true;
        $document.on('click', $scope.submit);
        const escHandle = $scope.$on('telemetry:esc', cancel);
        const modalCloseHandle = ModalUtils.preventModalCloseOnEsc($scope.$parent);

        $timeout(() => $document[0].getElementById('renameable-property-input').focus());

        function close () {
            modalCloseHandle();
            $document.off('click', $scope.submit);
            escHandle();
            $scope.edit.value = false;
        }
    };

    function bindEvalAsync (fn) {
        return function (...args) {
            $scope.$evalAsync(function () {
                return fn(...args);
            });
        };
    }
}

function renameableProperty() {
    return {
        templateUrl: 'js/components/renameableProperty/renameableProperty.html',
        restrict: 'E',
        controller: RenameableProperty,
        replace: true,
        scope: {
            value: '<',
            updateFunction: '&',
            allowNull: '<'
        }
    };
}

componentsModule.directive('renameableProperty', renameableProperty);
