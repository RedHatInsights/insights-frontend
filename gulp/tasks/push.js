/*global require, process*/

const gulp = require('gulp');
const git = require('gulp-git');
const got = require('got');
const baseUrl = 'https://insights-jenkins.rhev-ci-vms.eng.rdu2.redhat.com'
      + '/job/insights-frontend/job';
const deployTokenAuth = 'ihands:0c2928006651ef78558b248cc7972d80';

gulp.task('push', function () {
    git.revParse({args: '--abbrev-ref HEAD'}, function (err, branch) {
        const url = `${baseUrl}/${encodeURIComponent(branch)}`;

        git.push('origin', branch, function (err) {
            if (err) throw err;

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            console.log(`Kicking build for ${branch}`);

            got.post(`${url}/build`, {
                headers: { accept: 'application/json' },
                auth: deployTokenAuth
            }).then(res => {
                console.log(`Response code: ${res.statusCode}`);
                console.log(`Success, visit ${url} for details`);
            }).catch(error => {
                console.log(error);
                throw error;
            });
        });
    });
});
