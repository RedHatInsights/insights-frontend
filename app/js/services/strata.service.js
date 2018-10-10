/*global require*/
'use strict';

const servicesModule = require('./');
const urijs = require('urijs');
const get = require('lodash/get');
const SEARCH_URL = 'https://access.redhat.com/rs/search';
const OPTS = Object.freeze({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.redhat.solr+json',
        'X-Omit': 'WWW-Authenticate'
    }
});

/**
* @ngInject
*/
function StrataService ($http, $q) {

    function search (field, value) {
        const uri = urijs(SEARCH_URL).addSearch('q', `${field}:${value}`);
        return $http.get(uri.toString(), OPTS)
        .then(function (res) {
            const docs = get(res, 'data.response.docs');

            if (docs && docs.length) {
                return docs;
            }

            return $q.reject('no results');
        });
    }

    return {
        searchById: function (query) {
            return search('id', query);
        }
    };
}

servicesModule.service('StrataService', StrataService);
