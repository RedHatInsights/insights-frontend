/*global module*/

module.exports = {
    init: function debugInit(page) {
        console.log('Debugging initialized');

        page.onConsoleMessage = function onConsoleMessage(msg) {
            console.log('CONSOLE: ' + msg);
        };

        page.onResourceError = function onResourceError(resourceError) {
            console.log('Unable to load resource (#' + resourceError.id + ' URL:' + resourceError.url + ')');
            console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
        };

        page.onError = function onError(msg, trace) {
            var msgStack = ['ERROR: ' + msg];
            if (trace && trace.length) {
                msgStack.push('TRACE:');
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
                });
            }
            console.error(msgStack.join('\n'));
        };
    }
};
