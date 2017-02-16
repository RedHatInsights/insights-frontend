/*global require, process*/

/*global require, process*/

const gulp = require('gulp');
const git = require('gulp-git');
const got = require('got');
const deployTokenAuth = 'ihands:0c2928006651ef78558b248cc7972d80';
const jenkinsUrl = 'https://insights-jenkins.rhev-ci-vms.eng.rdu2.redhat.com';
const jobBaseUrl = `${jenkinsUrl}/job/insights-frontend/job`;
const branchIndexingUrl = `${jenkinsUrl}/job/insights-frontend/build?delay=0`;
const priv = {};

priv.encode = function getBranchUrlComponent(branch) {
    return encodeURIComponent(encodeURIComponent(branch));
};

https://insights-jenkins.rhev-ci-vms.eng.rdu2.redhat.com/job/insights-frontend/build?delay=0

gulp.task('kick', function () {
    git.revParse({args: '--abbrev-ref HEAD'}, function (err, branch) {
        const jobUrl = `${jobBaseUrl}/${priv.encode(branch)}`;

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        console.log(`Kicking build for ${branch}`);

        got.post(branchIndexingUrl, {
            followRedirect: false,
            auth: deployTokenAuth
        }).then(res => {
            console.log(`Response code: ${res.statusCode}`);
            console.log(`Success, visit ${jobUrl} for details`);
        }).catch(error => {
            console.log(error);
            throw error;
        });
    });
});
