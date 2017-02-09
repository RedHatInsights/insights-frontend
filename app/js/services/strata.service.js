'use strict';

const servicesModule = require('./');
const urijs = require('urijs');
const SEARCH_URL = 'https://access.redhat.com/rs/search';
const OPTS = Object.freeze({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Omit': 'WWW-Authenticate'
    }
});

/**
* @ngInject
*/
function StrataService ($http, $q) {

    function search (field, value) {
        const uri = urijs(SEARCH_URL).addSearch('keyword', `${field}:${value}`);
        return $http.get(uri.toString(), OPTS)
        .then(function (res) {
            if (res.data && res.data.search_result) {
                return res.data.search_result;
            }

            return $q.reject('no results');
        });
    }

    return {
        searchById: function (query) {
            return search('id', query);
        },

        searchByUri: function (query) {
            return search('view_uri', query);
        }
    };
}

servicesModule.service('StrataService', StrataService);
