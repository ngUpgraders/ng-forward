var gulp = require('gulp');
var babel = require('gulp-babel');
var karma = require('karma').server;
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var mocha = require('gulp-mocha');
var chai = require('chai');
 
gulp.task('build', function () {
	return gulp.src('src/**/*.js')
		.pipe(babel({
			stage : 0
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function (done) {
	return gulp.src('dist/**/*.spec.js')
		.pipe(mocha({ reporter : 'spec' }));
});