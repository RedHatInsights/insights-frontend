/*global require*/

const env    = require('system').env; // because on the container instance process is not global?
const lodash = require('lodash');

function dieIfEmpty(key)  {
    if(!lodash.get(env, key)) {
        throw new Error('Could not find required env var: ' + key);
    }
}

dieIfEmpty('TEST_URL');
dieIfEmpty('TEST_USERNAME');
dieIfEmpty('TEST_PASSWORD');


