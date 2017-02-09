/*global require, process*/
'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var pkg = require('./package');

var appPath = '/' + pkg.name + '/';
// insightsbeta rule
if (process.env.OPENSHIFT_APP_NAME && process.env.OPENSHIFT_APP_NAME === 'insightsbeta') {
    appPath = '/' + process.env.OPENSHIFT_APP_NAME + '/';
}

var port = process.env.PORT || process.env.NODE_PORT || 9000;
var ip = process.env.IP || process.env.NODE_IP || 'localhost';
var publicDir = '.';
var app = express();
var server = require('http').createServer(app);
var morgan = require('morgan');
var env = process.env.NODE_ENV || 'development';
var compression = require('compression');

app.use(compression());
app.disable('x-powered-by');

app.use(morgan('dev'));
var staticCache = {
    maxAge: 0
};
if ('production' === env) {
    // one month cache (static assets are revved)
    staticCache.maxAge = ((60 * 60 * 24 * 30) * 1000);

    ip = process.env.OPENSHIFT_NODEDIY_IP || process.env.OPENSHIFT_IOJS_IP || ip;
    port = process.env.OPENSHIFT_NODEDIY_PORT || process.env.OPENSHIFT_IOJS_PORT || port;
} else {
    var proxy = require('express-http-proxy');
    app.all(appPath + 'v1/*', proxy('localhost:9002', {
        forwardPath: function (req, res) {
            var path = require('url').parse(req.url).path;
            return path.replace('/insights', '/r/insights');
        }
    }));
}

app.use(appPath, express.static(path.resolve('.'), staticCache));

function fourOhFour(req, res) {
    return res.status(404).end();
}

function lubDub(req, res) {
    return res.status(200).end();
}

// browser support page
app.get(appPath + 'support/browser', function (req, res) {
    res.sendFile(path.resolve(publicDir + '/support/browser/index.html'));
});

// Requesting an asset and you got this far... what do you want from me?
// You get a 404.
app.get(appPath + 'js/*', fourOhFour);
app.get(appPath + 'css/*', fourOhFour);
app.get(appPath + 'fonts/*', fourOhFour);
app.get(appPath + 'images/*', fourOhFour);

app.get('/', lubDub);

app.get('/labs/insights/*', function (req, res) {
    res.redirect(301, req.originalUrl.replace('/labs', ''));
});

// angular HTML5 mode. you get the index file
app.get(appPath + '*', function (req, res) {
    res.sendFile(path.resolve(publicDir + '/index.html'));
});

// Start server
server.listen(port, ip, function () {
    console.log('Express server listening on %d, in %s mode, app mounted at %s', port, app.get('env'), appPath);
});
