/*global require*/
'use strict';

const componentsModule = require('../../');
const filter = require('lodash/filter');
const map = require('lodash/map');
const sortBy = require('lodash/sortBy');

/**
 * @ngInject
 */
function ResolutionModal($modalInstance,
                             $scope,
                             Maintenance,
                             ModalUtils,
                             SystemsService,
                             params) {
    $scope.MINIMUM_NUMBER_OF_ITEMS = $scope.listLimit = 5;
    $scope.params = params;
    $scope.selected = {};

    SystemsService.getSystemTypeAsync(params.play.system_type_id).then(systemType => {
        $scope.systemType = systemType;
    });

    $scope.systems = map(filter(params.plan.actions, function (action) {
        return action.rule.id === params.play.rule.rule_id &&
            action.system.system_type_id === params.play.system_type_id;
    }), 'system');

    $scope.selected.resolutionType = params.play.ansible_resolutions[0].resolution_type;
    $scope.resolutions = sortBy(params.play.ansible_resolutions, 'resolution_type');

    $scope.save = function () {
        Maintenance.saveResolutionPreference(
            params.plan.maintenance_id,
            params.play.rule.rule_id,
            params.play.system_type_id,
            $scope.selected.resolutionType)
        .then(function () {
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('close');
    };

    ModalUtils.suppressEscNavigation($modalInstance);
}

componentsModule.controller('ResolutionModal', ResolutionModal);
