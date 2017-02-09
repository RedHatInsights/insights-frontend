'use strict';

var componentsModule = require('../../../');
var capitalize = require('lodash/string/capitalize');

/**
 * @ngInject
 */
function ActionsLiteDirectiveCtrl(
    $scope,
    $q,
    Topic,
    HttpHeaders,
    Categories,
    Utils,
    gettextCatalog) {

    var priv = {};
    $scope.loader = new Utils.Loader(false);
    $scope.categories = Categories.filter(c => c !== 'all').map(function (c) {
        return {
            id: c,
            label: capitalize(c),
            count: 0
        };
    });

    priv.refresh = $scope.loader.bind(function () {
        const promises = $scope.categories.map(function (category) {
            return Topic.get(category.id).then(function (response) {
                category.count = response.data.affectedSystemCount;
                category.title = gettextCatalog.getPlural(
                    category.count,
                    '1 system affected by {{id}} issues',
                    '{{count}} systems affected by {{id}} issues',
                    category);
            });
        });

        return $q.all(promises);
    });

    $scope.$on('account:change', priv.refresh);
    priv.refresh();
}

function actionsLite() {
    return {
        templateUrl: 'js/components/overview/widgets/actionsLite/actionsLite.html',
        restrict: 'E',
        replace: true,
        controller: ActionsLiteDirectiveCtrl,
        scope: {}
    };
}

componentsModule.directive('actionsLite', actionsLite);
