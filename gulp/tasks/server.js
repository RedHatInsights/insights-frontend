/*global require, global, process*/
'use strict';

const config = require('../config');
const http = require('http');
const express = require('express');
const gulp = require('gulp');
const gutil = require('gulp-util');
const morgan = require('morgan');
const path = require('path');
const dbHost = process.env.INSIGHTS_DB_HOST || 'localhost:9002';

gulp.task('server', function () {
    const server = express();

    // log all requests to the console
    server.use(morgan('dev'));
    server.all('/', function (req, res) {
        res.sendFile('vanilla.html', {
            root: 'build'
        });
    });

    let appPath = '/insights/';
    const proxy = require('express-http-proxy');

    if (global.isBeta) {
        // bounce requests to /insights/ for dev convinience
        server.all('/insights/*', function (req, res) {
            res.redirect(301, '/insightsbeta/');
        });

        appPath = '/insightsbeta/';
    }

    const devProxy = proxy(dbHost, {
        forwardPath: function (req) {
            const path = require('url').parse(req.url).path;

            // replace the /base/local with /r/insights as it goes to the proxy
            // /local/systems  -> /r/insights/systems
            // /local/v1/rules -> /r/insights/v1/rules
            // etc. etc.

            return path.replace(appPath + 'local', '/r/insights');
        }
    });

    server.use('/', express.static(config.dist.root));
    server.use(appPath, express.static(config.dist.root));

    // setup this passthrough for developers who want to hit their local API
    server.all(appPath + 'local/*', devProxy);

    // browser support page
    server.get(appPath + 'support/browser', function (req, res) {
        res.sendFile(path.resolve('/support/browser/index.html'));
    });

    // Serve index.html for all routes to leave routing up to Angular
    server.all(appPath + '*', function (req, res) {
        res.sendFile('index.html', {
            root: 'build'
        });
    });

    // Start webserver if not already running
    const s = http.createServer(server);
    s.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            gutil.log(
                'Browserify server is already started at port ' + config.syncproxyport);
        } else {
            throw err;
        }
    });

    s.listen(config.syncproxyport);
});
