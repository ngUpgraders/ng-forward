var tsConfig = require('./tsconfig.json');

tsConfig.compilerOptions.target = 'es5';

module.exports = function(config){
	var options = {
		basePath: 'dist',
		browsers: ['Chrome'],
		frameworks: ['angular', 'mocha', 'browserify', 'sinon-chai'],
		reporters: ['mocha'],
		angular: ['mocks'],

		files: [
			require.resolve('babel-polyfill'),
			'../node_modules/reflect-metadata/Reflect.js',
			'lib/**/*.spec.js'
		],

		preprocessors: {
			'lib/**/*.js': ['browserify']
		},

		browserify: {
			debug: true,
			watch: true,
			transform: [
				['babelify', {
					presets: ['es2015', 'stage-0'],
					plugins: ['transform-es2015-modules-commonjs']
				}],
				['aliasify', { aliases: {
					'@reactivex/rxjs/dist/es6/Subject': '@reactivex/rxjs/dist/cjs/Subject'
				}}]
			]
		},

		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		}
	};

	if(process.env.TRAVIS){
		options.browsers = ['Chrome_travis_ci'];
	}

	config.set(options);
};
