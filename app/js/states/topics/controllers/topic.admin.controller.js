'use strict';

var statesModule = require('../../');

/**
 * @ngInject
 */
function TopicAdminCtrl($scope, sweetAlert, Topic, $state, Utils) {
    $scope.loader = new Utils.Loader();

    let loadData = $scope.loader.bind(function () {
        return Topic.admin().then(function (resp) {
            $scope.topics = resp.data;
        });
    });

    loadData();

    $scope.$watchCollection('topics', updateTopicOrder);

    $scope.newTopic = function () {
        Topic.create({
            title: 'Unnamed topic'
        }).then(function (res) {
            $state.go('app.edit-topic', {
                id: res.data.id
            });
        });
    };

    function updateTopicOrder () {
        if (angular.isDefined($scope.topics)) {
            for (let i = 0; i < $scope.topics.length; i++) {
                $scope.topics[i].priority = i;
            }
        }
    }

    $scope.move = function (topic, up) {
        if ((topic.priority === 0 && up) ||
            (topic.priority === $scope.topics.length - 1 && !up)) {
            return;
        }

        let otherIndex = (up ? -1 : 1) + topic.priority;
        let t1 = $scope.topics[topic.priority] = $scope.topics[otherIndex];
        let t2 = $scope.topics[otherIndex] = topic;
        updateTopicOrder();
        Topic.update({id: t1.id, priority: t1.priority});
        Topic.update({id: t2.id, priority: t2.priority});
    };

    $scope.delete = function (topic) {
        createAlert(
            'Are you sure?',
            'Topic will be lost.',
            'Yes',
            function () {
                Topic.remove(topic.id).then(function () {
                    $scope.topics.splice($scope.topics.indexOf(topic), 1);
                });
            });
    };

    function hideInternal(topic, value) {
        Topic.update({
            id: topic.id,
            hidden: value
        }).then(function () {
            topic.hidden = value;
        });
    }

    $scope.hide = function (topic, value) {
        if (!value) {
            return createAlert(
                'Are you sure?',
                'Publishing this topic makes it visible to customers.',
                'Publish',
                function () {
                    hideInternal(topic, value);
                });
        }

        hideInternal(topic, value);
    };

    function createAlert(title, text, confirmButtonText, cb) {
        sweetAlert({
            title: title,
            text: text
        }).then(cb);
    }
}

statesModule.controller('TopicAdminCtrl', TopicAdminCtrl);
