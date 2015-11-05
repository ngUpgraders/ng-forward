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
const tsBuildProject = ts.createProject('tsconfig.json', {
	declaration: true,
	noLib: true,
	outDir: 'es6'
});

async function deleteDistFolder(){
	await del(['./dist']);
}

function typescriptToES6(){
	let result = tsBuildProject.src()
		.pipe(sourcemaps.init())
		.pipe(ts(tsBuildProject));

	return merge([
		result.js.pipe(sourcemaps.write()).pipe(gulp.dest('dist')),
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
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({ modules: 'common', stage: 0 }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/cjs'));

	let move = gulp.src('./dist/es6/**/*.d.ts')
		.pipe(gulp.dest('./dist/cjs'));

	return merge([ transpile, move ]);
}

function testES6(watch){
	return done => {
		let config = {configFile: join(__dirname, 'karma.conf.js')};

		if (!watch) {
			config.singleRun = true;
			config.reporters = ['dots'];
		}

		let server = new KarmaServer(config, done);
		server.start();
	}
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

function moveMiscFiles(){
	return gulp.src([
			'./package.json',
			'./build/**.js',
			'./README.md'
		])
		.pipe(gulp.dest('./dist'));
}

gulp.task('clean-dist', deleteDistFolder);
gulp.task('build/ts-to-es6', typescriptToES6);
gulp.task('build/test', testES6(false));
gulp.task('build/lib-to-es6', buildES6Dist);
gulp.task('build/es6-to-cjs', buildCJSDist);
gulp.task('build/rollup', rollupES6);
gulp.task('build/bundle-to-es5', bundleToES5);
gulp.task('build/create-sfx-bundle', createSFXBundle);
gulp.task('build/cleanup', cleanupDistFolder);
gulp.task('build/move-misc-files', moveMiscFiles);

gulp.task('watch/test', testES6(true));
gulp.task('watch/ts-to-es6', () => {
	gulp.watch('lib/**/*.ts', ['build/ts-to-es6']);
});

gulp.task('build', done => {
	runSequence(
			'clean-dist',
			'build/ts-to-es6',
			'build/test',
			'build/lib-to-es6',
			'build/es6-to-cjs',
			'build/rollup',
			'build/bundle-to-es5',
			'build/create-sfx-bundle',
			'build/cleanup',
			'build/move-misc-files',
			done
	)
});

gulp.task('dev', done => {
	runSequence(
			'build/ts-to-es6',
			['watch/ts-to-es6', 'watch/test'],
			done
	);
});

gulp.task('default', ['build']);
