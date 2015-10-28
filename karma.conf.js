var tsConfig = require('./tsconfig.json');

tsConfig.compilerOptions.target = 'es5';

module.exports = function(config){
	config.set({
		basePath: 'dist',
		browsers: ['Chrome'],
		frameworks: ['angular', 'mocha', 'browserify', 'sinon-chai', 'phantomjs-shim'],
		reporters: ['mocha'],
		angular: ['mocks'],

		files: [
			'../node_modules/reflect-metadata/Reflect.js',
			'lib/**/*.spec.js'
		],

		preprocessors: {
			'lib/**/*.js': ['browserify']
		},

		browserify: {
			debug: true,
			watch: true,
			noParse: [
				require.resolve('sinon-chai')
			],
			transform: [
				['babelify', { stage: 0 }],
				['aliasify', { aliases: {
					'@reactivex/rxjs/dist/es6/Subject': '@reactivex/rxjs/dist/cjs/Subject'
				}}]
			]
		}
	});
};
