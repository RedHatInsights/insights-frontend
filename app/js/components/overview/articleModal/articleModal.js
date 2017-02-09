/*global require*/
'use strict';

var componentsModule = require('../../');
var pick = require('lodash/object/pick');
var find = require('lodash/collection/find');

/**
 * @ngInject
 */
function ArticleModalCtrl(
    $scope,
    OverviewService,
    $modalInstance,
    Article,
    InsightsConfig,
    ModalUtils) {

    $scope.selected = {};

    $scope.close = function () {
        $modalInstance.dismiss('close');
    };

    $scope.save = function () {
        OverviewService.update($scope.selected.article.id, $scope.article)
        .then($scope.close);
    };

    $scope.preview = function () {
        Article.preview($scope.article).then(function (res) {
            $scope.previewData = res.data;
        });
    };

    $scope.load = function (id) {
        Article.get(id).then(function (res) {
            $scope.article = pick(res.data, ['title', 'content']);
        });
    };

    Article.getArticles().then(function (res) {
        var current = {id: InsightsConfig.overviewKey};
        $scope.articles = res.data;
        if (!find($scope.articles, current)) {
            $scope.articles.push(current);
            $scope.selected.article = current;
        }
    });

    $scope.$watch('selected.article', function (value) {
        if (value && value.id) {
            $scope.load(value.id);
            $scope.previewData = null;
        }
    });

    $scope.selected.article = OverviewService.article;
    ModalUtils.suppressEscNavigation($modalInstance);
}

componentsModule.controller('ArticleModalCtrl', ArticleModalCtrl);
