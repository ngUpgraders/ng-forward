module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'src/**/*.js',
			'test/**/*.js'
		],
		preprocessors: {
			'src/**/*.js': ['babel'],
			'test/**/*.js': ['babel']
		},
		babelPreprocessor: {
			options: {
				sourceMap: 'inline'
			},
			filename: function(file) {
				return file.originalPath.replace(/\.js$/, '.es5.js');
			},
			sourceFileName: function(file) {
				return file.originalPath;
			}
		}
	});
};