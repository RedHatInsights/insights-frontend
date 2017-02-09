'use strict';

var componentsModule = require('../../');

componentsModule.directive('kbaseSolution', function ($q, $http, StrataService) {

    function validator (property, value) {
        return function (results) {
            if (results.length !== 1 || results[0][property].trim() !== value.trim()) {
                $q.reject('no match');
            }
        };
    }

    function validateId (id) {
        return StrataService.searchById(id).then(validator('display_id', id));
    }

    function validateUrl (url) {
        return StrataService.searchByUri(url).then(validator('view_uri', url));
    }

    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.kbaseSolution = function (model) {
                if (ctrl.$isEmpty(model)) {
                    return $q.when(); // empty model considered valid
                }

                if (/^\d+$/.test(model)) {
                    return validateId(model); // numeric kbase id - let's verify it
                }

                if (model.indexOf('http') > -1) {
                    return validateUrl(model); // kbase URL - let's verify it
                }

                return $q.reject();
            };
        }
    };
});
