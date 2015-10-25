import gulp from 'gulp';
import ts from 'gulp-typescript';
import {rollup} from 'rollup';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import rimraf from 'rimraf';
import uglify from 'gulp-uglify';

gulp.task('clean', done => {
	rimraf('./dist', done);
});

gulp.task('transpile', () => {
	let tsProject = ts.createProject('tsconfig.json');
	let result = tsProject.src()
		.pipe(ts(tsProject));

		return result.js.pipe(gulp.dest('dist'));
});

gulp.task('bundle', ['transpile'], (async () => {
	let bundle = await rollup({
		entry: './dist/lib/index.js'
	});

	await bundle.write({
		format: 'cjs',
		dest: './dist/ng-forward.es6.js'
	});
}));

gulp.task('build', ['bundle'], () => {
	return gulp.src('./dist/ng-forward.es6.js')
		.pipe(babel({ modules: 'umd' }))
		.pipe(uglify())
		.pipe(rename('ng-forward.js'))
		.pipe(gulp.dest('dist'));
});
