'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _writers = require('../../writers');

var View = function View(config) {
	return function (t) {
		if (typeof config !== 'object' || !config.url && !config.inline) {
			throw new Error('Config object must be passed to the view decorator with either a view URL or an inline view');
		}

		if (config.url) {
			if (_writers.componentWriter.has('template', t)) {
				_writers.componentWriter['delete']('template', t);
			}

			_writers.componentWriter.set('templateUrl', config.url, t);
		} else {
			if (_writers.componentWriter.has('templateUrl', t)) {
				_writers.componentWriter['delete']('templateUrl', t);
			}

			_writers.componentWriter.set('template', config.inline, t);
		}
	};
};
exports.View = View;