'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function topicAdminHelpBar($document) {
    return {
        scope: true,
        templateUrl: 'js/components/topics/topicAdminHelpBar/topicAdminHelpBar.html',
        restrict: 'E',
        replace: true,
        link: function ($scope, element, attrs) {

            var textArea;
            angular.forEach($document.find('textarea'), function (element) {
                if (element.id === attrs.textArea) {
                    textArea = element;
                }
            });

            if (!textArea) {
                throw new Error ('Unable to find text area with id: ' + attrs.textArea);
            }

            function appendToContent(value) {
                var position = textArea.selectionStart;
                var text = textArea.value;
                if (!text) {
                    text = '';
                }

                let prefix = text.substring(0, position);
                let suffix = text.substring(position);
                textArea.value = prefix + value + suffix;
                textArea.selectionStart = textArea.selectionEnd = position + value.length;
                $scope.topic.content = textArea.value;
            }

            $scope.help = {
                show: false
            };
            $scope.help.appendInterpolation = function ($event) {
                var text = 'topic.actions.totalCount';
                if ($event) {
                    text = $event.target.text.trim();
                }

                appendToContent('{{= ' + text + ' }}');
            };

            $scope.help.appendConditional = function () {
                appendToContent(
                    '\n{{? topic.actions.totalCount}}\nActions found!' +
                    '\n{{??}}\nNo actions found!\n{{?}}\n');
            };

            $scope.help.interpolations = [];
            $scope.help.createInterpolations = function () {
                if (!$scope.topic || !$scope.topic.rules) {
                    return;
                }

                let statics = [{
                    key: 'systems.totalCount',
                    value: 'Number of systems with a given product ' +
                        '(or all systems combined if no product selected)'
                }, {
                    key: 'systems.affectedCount',
                    value: 'Number of systems affected by this topic'
                }, {
                    key: 'product.code',
                    value: 'Product code (rhel, rhev, osp or docker)'
                }, {
                    key: 'topic.rules.totalCount',
                    value: 'Number of rules that belong to this topic'
                }, {
                    key: 'topic.rules.ackedCount',
                    value: 'Number of rules that belong to this topic ' +
                        'and are ignored (acked) by the customer'
                }, {
                    key: 'topic.actions.totalCount',
                    value: 'Number of actions (rule violations on systems) for this topic'
                }];

                let single = [{
                    key: 'topic.rule.actionCount',
                    value: 'Number of actions for the given rule'
                }, {
                    key: 'topic.rule.description',
                    value: 'Name of the rule'
                }, {
                    key: 'topic.rule.link',
                    value: 'Link to a page for the given rule'
                }, {
                    key: 'topic.rule.category',
                    value: 'Rule category (Security, Performance, ' +
                            'Availability or Stability)'
                }, {
                    key: 'topic.rule.severity',
                    value: 'Rule severity (ERROR, WARN, INFO)'
                }, {
                    key: 'topic.rule.acked',
                    value: 'Indicated whether this rule has ' +
                        'been ignored (acked) by the user'
                }];

                if ($scope.ruleBinding === 'explicit' &&
                    $scope.topic.rules.length === 1) {

                    $scope.help.interpolations = statics.concat(single);
                } else {
                    let ruleId = $scope.selectedRule;
                    $scope.help.interpolations = statics.concat([{
                        key: 'topic.rules.byId[\'' + ruleId + '\'].actionCount',
                        value: single[0].value
                    }, {
                        key: 'topic.rules.byId[\'' + ruleId + '\'].description',
                        value: single[1].value
                    }, {
                        key: 'topic.rules.byId[\'' + ruleId + '\'].link',
                        value: single[2].value
                    }, {
                        key: 'topic.rules.byId[\'' + ruleId + '\'].category',
                        value: single[3].value
                    }, {
                        key: 'topic.rules.byId[\'' + ruleId + '\'].severity',
                        value: single[4].value
                    }, {
                        key: 'topic.rules.byId[\'' + ruleId + '\'].acked',
                        value: single[5].value
                    }]);
                }
            };

            $scope.$watchCollection('topic.rules', $scope.help.createInterpolations);
            $scope.$watch('selectedRule', $scope.help.createInterpolations);
        }
    };
}

componentsModule.directive('topicAdminHelpBar', topicAdminHelpBar);
