'use strict';

var gulp = require('gulp');
var prefix = require('./');

gulp.task('prefix', function () {
	return gulp.src('/tmp/toto')
	.pipe(prefix('unprefix'))
	.pipe(gulp.dest('/tmp/'));
})