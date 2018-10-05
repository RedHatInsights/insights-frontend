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

function buildEventsForRootNoName(root) {
    var eventObj = {};
    eventObj = {};
    root.events.forEach(function (event) {
        eventObj[event] = event;
    });

    return eventObj;
}

function buildEvents(eventRoots) {
    var eventsObj = {};
    eventRoots.forEach(function (root) {
        if (root.name === 'filters') {
            eventsObj[root.name] = buildEventsForRootNoName(root);
        } else {
            eventsObj[root.name] = buildEventsForRoot(root);
        }
    });

    return eventsObj;
}

let _EVENT_ROOTS = [{
    name: 'cards',
    events: ['expandAll', 'collapseAll', 'toggleCard']
}, {
    name: 'filters',
    events: ['actionsSelect',
             'age',
             'categorySelect',
             'checkInSelect',
             'daysKnown',
             'rhsaSeverity',
             'incident',
             'maintenanceCategorySelect',
             'populatedProducts',
             'reset',
             'riskOfChangeSelect',
             'totalRisk',
             'tag',
             'multipleTags',
             'removeMultipleTags',
             'removeTag',
             'ansibleSupport',
             'ruleStatus',
             'ruleHit',
             'likelihood',
             'impact']
}, {
    name: 'checkboxes',
    events: ['reset']
}, {
    name: 'planner',
    events: ['planChanged', 'planDeleted', 'reloadTable', 'plansLoaded', 'openPlan']
}];

constantsModule.constant('Events', buildEvents(_EVENT_ROOTS));
