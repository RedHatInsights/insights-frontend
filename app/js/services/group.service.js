'use strict';

const servicesModule = require('./');
const map = require('lodash/map');
const sortBy = require('lodash/sortBy');
const pick = require('lodash/pick');
const some = require('lodash/some');
const escape = require('lodash/escape');

/**
* @ngInject
*/
function GroupService($q, gettextCatalog, sweetAlert, Group) {

    function groupNameValidator (name) {
        if (!name || typeof name !== 'string' || !name.length) {
            return $q.reject(gettextCatalog
                .getString('Please specify a system group name'));
        }

        if (some(Group.groups, group => group.display_name === name)) {
            return $q.reject(gettextCatalog.getString('Name already used'));
        }

        return $q.resolve();
    }

    function groupSystems (selectedSystems) {

        function assignSystemsToGroup (group) {
            const systems = map(selectedSystems, s => pick(s, 'system_id'));
            return Group.addSystems(group, systems).then(() => group);
        }

        // no groups - skip directly to creating new group
        if (!Group.groups.length) {
            return createGroup().then(assignSystemsToGroup).then(Group.setCurrent);
        }

        const groups = sortBy(Group.groups, 'display_name');
        groups.unshift({
            display_name: gettextCatalog.getString('Create new System Group')
        });
        const options = map(groups, 'display_name');

        return sweetAlert({
            title: gettextCatalog.getString('Group Systems'),
            type: undefined,
            input: 'select',
            inputOptions: options,
            confirmButtonText: gettextCatalog.getString('OK')
        }).then(function (param) {
            const index = parseInt(param);

            // creating new group
            if (index === 0) {
                return createGroup()
                    .then(assignSystemsToGroup)
                    .then(Group.setCurrent)
                    .catch(function () {
                        return groupSystems(selectedSystems);
                    });
            }

            // adding to existing group
            const group = groups[index];
            return assignSystemsToGroup(group).then(Group.setCurrent);
        });
    }

    function createGroup () {
        return sweetAlert({
            title: gettextCatalog.getString('Create new System Group'),
            input: 'text',
            type: undefined,
            confirmButtonText: gettextCatalog.getString('Create'),
            inputPlaceholder: gettextCatalog.getString('Group name'),
            inputValidator: groupNameValidator
        }).then(function (name) {
            return Group.createGroup({
                display_name: name
            });
        });
    }

    function deleteGroup (group) {
        const html = gettextCatalog.getString(
            'You will not be able to recover <code>{{name}}</code>',
            {
                name: escape(group.display_name)
            });
        sweetAlert({
            html
        }).then(function () {
            return Group.deleteGroup(group);
        }).then(function () {
            if (group.id === Group.current().id) {
                Group.setCurrent();
            }
        });
    }

    return {
        groupSystems,
        createGroup,
        deleteGroup
    };
}

servicesModule.service('GroupService', GroupService);
