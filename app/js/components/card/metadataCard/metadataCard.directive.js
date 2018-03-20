/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */

function metadataCardCtrl() {

}

function metadataCard() {
    return {
        scope: {
            system: '='
        },
        templateUrl: 'js/components/card/metadataCard/metadataCard.html',
        restrict: 'E',
        replace: true,
        controller: metadataCardCtrl
    };
}

componentsModule.directive('metadataCard', metadataCard);
