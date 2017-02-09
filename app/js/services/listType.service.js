/*global require*/
'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function ListTypeService(TableToCardsBreakpoint) {
    const types = Object.freeze({
        card: 'card',
        table: 'table'
    });

    let type = types.card;
    let decideType = function decideType (event) {
        if (event.matches) {
            type = types.table;
        } else {
            type = types.card;
        }
    };

    let mediaQuery = window.matchMedia(`(min-width: ${TableToCardsBreakpoint})`);

    // on construction set type based on window
    decideType(mediaQuery);

    // listen to all further changes
    // the trello card does not really ask for this...
    mediaQuery.addListener(decideType);

    return {
        types: () => types,
        getType: () => type,
        setType: (input) => type = types[input]
    };
}

servicesModule.service('ListTypeService', ListTypeService);
