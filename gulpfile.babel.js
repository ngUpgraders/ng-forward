import gulp from 'gulp';
import ts from 'gulp-typescript';
import {rollup} from 'rollup';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import rimraf from 'rimraf';
import uglify from 'gulp-uglify';
import {Server as KarmaServer, LOG} from 'karma';
import {join} from 'path';
import runSequence from 'run-sequence';

let tsconfig = require('./tsconfig.json');
let tsProject = ts.createProject('tsconfig.json');

gulp.task('clean-dist', done => {
	rimraf('./dist', done);
});

gulp.task('build/ts-to-es6', () => {
	let result = tsProject.src()
		.pipe(ts(tsProject));

	return result.js.pipe(gulp.dest('dist'));
});

gulp.task('build/rollup-es6', (async () => {
	let bundle = await rollup({
		entry: './dist/lib/index.js',
		external: ['reflect-metadata']
	});

	await bundle.write({
		dest: './dist/ng-forward.es6.js'
	});
}));

gulp.task('build/es6-to-umd-es5', () => {
	return gulp.src('./dist/ng-forward.es6.js')
		.pipe(rename('ng-forward.js'))
		.pipe(babel({ modules: 'umd' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('test', (done) => {
	let server = new KarmaServer({
		configFile: join(__dirname, 'karma.conf.js'),
		singleRun: true,
		reporters: ['dots']
	}, done);

	server.start();
});

gulp.task('test/karma-watch', (done) => {
	let server = new KarmaServer({
		configFile: join(__dirname, 'karma.conf.js'),
	}, done);

	server.start();
});

gulp.task('test/files-watch', () => {
	gulp.watch('lib/**/*.ts', ['build/ts-to-es6']);
});

gulp.task('dev', done => {
	runSequence(
			'clean-dist',
			'build/ts-to-es6',
			'build/rollup-es6',
			'build/es6-to-umd-es5',
			['test/karma-watch', 'test/files-watch'],
			done
	)
});

gulp.task('build', done => {
	runSequence(
			'clean-dist',
			'build/ts-to-es6',
			'build/rollup-es6',
			'build/es6-to-umd-es5',
			'test',
			done
	)
});

gulp.task('default', ['build']);
