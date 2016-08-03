var tsConfig = require('./tsconfig.json');

tsConfig.compilerOptions.target = 'es5';

module.exports = function(config){
	var options = {
		basePath: 'dist',
		browsers: ['Chrome'],
		frameworks: ['angular', 'mocha', 'browserify'],
		reporters: ['mocha'],
		angular: ['mocks'],

		files: [
			require.resolve('babel-core/browser-polyfill'),
			'../node_modules/reflect-metadata/Reflect.js',
			'lib/**/*.spec.js'
		],

		preprocessors: {
			'lib/**/*.js': ['browserify']
		},

		browserify: {
			watch: true,
			noParse: [
				// require.resolve('sinon-chai')
			],
			transform: [
				['babelify', { stage: 0 }],
				['aliasify', { aliases: {
					'rxjs-es/Subject': 'rxjs/Subject'
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
