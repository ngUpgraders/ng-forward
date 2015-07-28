module.exports = function(config) {
	config.set({
		basePath: './src',
		browsers: ['Chrome'],
		frameworks: ['angular', 'mocha', 'sinon-chai', 'browserify', 'phantomjs-shim'],
		reporters: ['mocha'],
		angular: ['mocks'],
		files: [
			{ pattern: './**/*.spec.js', watched: false }
		],
		preprocessors: {
			'./**/*.js': ['browserify']
		},
		browserify: {
			debug: true,
			transform: [
				['babelify', {stage: 0}]
			]
		}
	});
};