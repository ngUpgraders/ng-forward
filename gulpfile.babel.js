import gulp from 'gulp';
import ts from 'gulp-typescript';
import {rollup} from 'rollup';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import rimraf from 'rimraf';
import uglify from 'gulp-uglify';
import {Server as KarmaServer} from 'karma';
import {join} from 'path';

gulp.task('clean-dist', done => {
	rimraf('./dist', done);
});

gulp.task('build/ts-to-es6', ['clean-dist'], () => {
	let tsProject = ts.createProject('tsconfig.json');
	let result = tsProject.src()
		.pipe(ts(tsProject));

		return result.js.pipe(gulp.dest('dist'));
});

gulp.task('build/rollup-es6', ['build/ts-to-es6'], (async () => {
	let bundle = await rollup({
		entry: './dist/lib/index.js'
	});

	await bundle.write({
		dest: './dist/ng-forward.es6.js'
	});
}));

gulp.task('build/es6-to-umd-es5', ['build/rollup-es6'], () => {
	return gulp.src('./dist/ng-forward.es6.js')
		.pipe(rename('ng-forward.js'))
		.pipe(babel({ modules: 'umd' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('test', ['build/es6-to-umd-es5'], (done) => {
	let server = new KarmaServer({
		configFile: join(__dirname, 'karma.conf.js'),
		singleRun: true
	}, done);

	server.start();
});


gulp.task('build', ['test']);
