'use strict';

var gulp = require('gulp');
var spawn = require('child_process').spawn;

gulp.task('component-list', function (done) {
	var proc = spawn('python', ['component_list.py']);
	var output = '';
	var err = '';
	proc.stdout.on('data', function(data) {
		output += data.toString();
	});
	proc.stderr.on('data', function(data) {
		err += data.toString();
	});
	proc.on('close', function() {
		console.log(output);
		if (err) {
			console.log(err)
		}
		done();
	});
});