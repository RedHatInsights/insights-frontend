'use strict';

var constantsModule = require('./');

function buildEventsForRoot(root) {
    var eventObj = {};
    eventObj = {};
    root.events.forEach(function (event) {
        eventObj[event] = root.name + ':' + event;
    });

    return eventObj;
}

function buildEvents(eventRoots) {
    var eventsObj = {};
    eventRoots.forEach(function (root) {
        eventsObj[root.name] = buildEventsForRoot(root);
    });

    return eventsObj;
}

let _EVENT_ROOTS = [{
    name: 'cards',
    events: ['expandAll', 'collapseAll']
}, {
    name: 'filters',
    events: ['populatedProducts', 'reset']
}, {
    name: 'checkboxes',
    events: ['reset']
}, {
    name: 'topicFilters',
    events: ['incident', 'reset']
}];

constantsModule.constant('Events', buildEvents(_EVENT_ROOTS));
