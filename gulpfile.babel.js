import gulp from 'gulp';
import ts from 'gulp-typescript';
import {rollup} from 'rollup-babel';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import rimraf from 'rimraf';
import uglify from 'gulp-uglify';
import {Server as KarmaServer, LOG} from 'karma';
import {join} from 'path';
import runSequence from 'run-sequence';
import sourcemaps from 'gulp-sourcemaps';
import merge from 'merge2';
import del from 'del';
import replace from 'gulp-replace';
import filter from 'gulp-filter';
import concat from 'gulp-concat';

const tsconfig = require('./tsconfig.json');
const tsProject = ts.createProject('tsconfig.json', {
	declaration: true,
	noLib: true,
	outDir: 'es6'
});

async function deleteDistFolder(){
	await del(['./dist']);
}

function typescriptToES6(){
	let result = tsProject.src()
		// .pipe(sourcemaps.init())
		.pipe(ts(tsProject));

	return merge([
		result.js./*pipe(sourcemaps.write()).*/pipe(gulp.dest('dist')),
		result.dts.pipe(gulp.dest('dist'))
	]);
}

function buildES6Dist(){
	let transpile = gulp.src('./dist/lib/**/*.js')
		.pipe(filter(['**/*', '!**/*.spec.js']))
		.pipe(replace('@reactivex/rxjs/dist/es6', '@reactivex/rxjs/dist/cjs'))
		.pipe(gulp.dest('./dist/es6'));

	let move = gulp.src('./dist/lib/**/*.d.ts')
		.pipe(filter(['**/*', '!**/*.spec.d.ts']))
		.pipe(gulp.dest('./dist/es6'));

	return merge([ transpile, move ]);
}

function buildCJSDist(){
	let transpile = gulp.src('./dist/es6/**/*.js')
		// .pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({ modules: 'common', stage: 0 }))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/cjs'));

	let move = gulp.src('./dist/es6/**/*.d.ts')
		.pipe(gulp.dest('./dist/cjs'));

	return merge([ transpile, move ]);
}

function testES6(done){
	let server = new KarmaServer({
		configFile: join(__dirname, 'karma.conf.js'),
		singleRun: true,
		reporters: ['dots']
	}, done);

	server.start();
}

async function rollupES6(){
	let bundle = await rollup({
		entry: './dist/lib/index.js',
		external: ['reflect-metadata']
	});

	await bundle.write({
		dest: './dist/ng-forward.es6.js'
	});
}

function bundleToES5(){
	return gulp.src('./dist/ng-forward.es6.js')
		.pipe(rename('ng-forward.js'))
		.pipe(babel({ modules: 'umd', stage: 0 }))
		.pipe(rename('ng-forward.es5.js'))
		.pipe(gulp.dest('./dist'));
}

function createSFXBundle(){
	return gulp.src([
			require.resolve('babel-core/browser-polyfill'),
			require.resolve('reflect-metadata'),
			'./dist/ng-forward.es5.js'
		])
		.pipe(concat('ng-forward.dist.js'))
		.pipe(gulp.dest('./dist'))

		.pipe(uglify())
		.pipe(rename('ng-forward.dist.min.js'))
		.pipe(gulp.dest('./dist'))
}

async function cleanupDistFolder(){
	await del([
		'./dist/lib',
		'./dist/ng-forward.es6.js',
		'./dist/ng-forward.es5.js'
	]);
}

function createPackage(){
	return gulp.src(['./package.json', './build/**.js'])
		.pipe(gulp.dest('./dist'));
}

gulp.task('clean-dist', deleteDistFolder);
gulp.task('build/ts-to-es6', ['clean-dist'], typescriptToES6);
gulp.task('build/test', ['build/ts-to-es6'], testES6);
gulp.task('build/lib-to-es6', ['build/test'], buildES6Dist);
gulp.task('build/es6-to-cjs', ['build/lib-to-es6'], buildCJSDist);
gulp.task('build/rollup', ['build/es6-to-cjs'], rollupES6);
gulp.task('build/bundle-to-es5', ['build/rollup'], bundleToES5);
gulp.task('build/create-sfx-bundle', ['build/bundle-to-es5'], createSFXBundle);
gulp.task('build/cleanup', ['build/create-sfx-bundle'], cleanupDistFolder);
gulp.task('build', ['build/cleanup'], createPackage);

gulp.task('dev', done => {
	runSequence(
			'build',
			['test/karma-watch', 'test/files-watch'],
			done
	);
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

gulp.task('default', ['build']);
