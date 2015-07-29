/* global __dirname */
import gulp from 'gulp';
import path from 'path';
import babel from 'gulp-babel';
import {Server as KarmaServer} from 'karma';

gulp.task('build', function () {
	return gulp.src('src/**/*.js')
		.pipe(babel({
			stage: 0
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', function(){
	gulp.watch('./src/**/*.js', ['build']);
});

gulp.task('test', ['build'], function(done){
  let server = new KarmaServer({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: true
	}, done);

	server.start();
});
