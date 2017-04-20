/*global require*/
'use strict';

var componentsModule = require('../../');
var cloneDeep = require('lodash/cloneDeep');
var pick = require('lodash/object/pick');

/**
 * @ngInject
 */
function TopicPreviewModalCtrl($scope, topic, Topic, summary, details, DataUtils, Utils) {
    $scope.summary = summary;
    $scope.details = details;

    $scope.editData = false;
    $scope.loader = new Utils.Loader();
    $scope.topic = {};

    let loadPreview = $scope.loader.bind(function (topic) {
        return Topic.preview(topic).then(function (res) {
            $scope.topic = res.data;
            $scope.topic.rules.forEach(DataUtils.readRule);
            $scope.sampleData = {
                rules: cloneDeep($scope.topic.rules),
                systems: {
                    affectedCount: $scope.topic.affectedSystemCount
                }
            };
        },

        function (res) {
            if (res.status === 404) {
                $scope.topic = null;
            }
        });
    });

    $scope.updateSampleData = function () {
        var data = pick(topic,
            ['title', 'content', 'summary', 'alwaysShow',
                'tag', 'category', 'rules']);
        data.overrides = {
            rules: $scope.sampleData.rules.map(function (rule) {
                return {
                    rule_id: rule.rule_id,
                    hitCount: rule.hitCount,
                    acked: rule.acked
                };
            }),

            systems: $scope.sampleData.systems
        };
        loadPreview(data);
    };

    loadPreview(topic);
}

componentsModule.controller('TopicPreviewModalCtrl', TopicPreviewModalCtrl);
