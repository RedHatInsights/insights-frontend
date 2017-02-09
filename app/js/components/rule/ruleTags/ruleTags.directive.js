'use strict';

var componentsModule = require('../../');
var indexBy = require('lodash/collection/indexBy');

/**
 * @ngInject
 */
function ruleTagsCtrl($scope, Rule, SweetAlert, $q) {
    $scope.predicate = 'name';
    $scope.reverse = false;

    $scope.tagPattern = /^[a-z0-9\.\-]+$/;

    $scope.loading = true;
    function loadingDone () {
        $scope.loading = false;
    }

    let tags = Rule.getAvailableTags().then(function (res) {
        $scope.setTags(res.data);
        $scope.tags.forEach(function (tag) {
            tag.rules = [];
        });
    });

    let rules = Rule.admin().then(function (res) {
        $scope.rules = res.data;
    });

    $q.all([tags, rules]).then(function () {
        var tagsByName = indexBy($scope.tags, 'name');
        $scope.rules.forEach(function (rule) {
            if (angular.isDefined(rule.rule.tags)) {
                rule.rule.tags.forEach(function (tag) {
                    if (tag.name in tagsByName) {
                        tagsByName[tag.name].rules.push(rule.rule);
                    }
                });
            }
        });
    }).then(loadingDone, loadingDone);

    $scope.update = function (tag) {
        $scope.loading = true;
        Rule.updateTag(tag).then(loadingDone, loadingDone);
    };

    $scope.delete = function (tag) {
        SweetAlert.swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this tag. ' +
                'The tag is currently used on ' + tag.rules.length + ' rules.',
            type: 'warning',
            html: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            showCancelButton: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.loading = true;
                Rule.deleteTag(tag.name).then(function () {
                    $scope.tags.splice($scope.tags.indexOf(tag), 1);
                }).then(loadingDone, loadingDone);
            }
        });
    };

    $scope.addTag = function (name) {
        $scope.newName = '';
        $scope.newTag.$setPristine();
        $scope.loading = true;
        Rule.updateTag({name: name}).then(function (res) {
            if (res.status === 201) {
                $scope.tags.push({name: name, description: '', rules: []});
            }
        }).then(loadingDone, loadingDone);
    };
}

function ruleTags() {
    return {
        scope: true,
        templateUrl: 'js/components/rule/ruleTags/ruleTags.html',
        restrict: 'E',
        replace: true,
        controller: ruleTagsCtrl
    };
}

componentsModule.directive('ruleTags', ruleTags);
