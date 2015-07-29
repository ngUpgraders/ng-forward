'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('../../writers');

var _injectables = require('../injectables');

var View = function View(config) {
	return function (t) {
		if (typeof config !== 'object' || !config.templateUrl && !config.template || t === undefined) {
			throw new Error('Config object must be passed to the view decorator with either a view url or an inline template');
		}

		if (config.templateUrl) {
			if (_writers.componentWriter.has('template', t)) {
				_writers.componentWriter.set('template', undefined, t);
			}

			_writers.componentWriter.set('templateUrl', config.templateUrl, t);
		} else if (config.template) {
			if (_writers.componentWriter.has('templateUrl', t)) {
				_writers.componentWriter.set('templateUrl', undefined, t);
			}

			_writers.componentWriter.set('template', config.template, t);
		}

		if (config.directives) {
			_injectables.Injectables.apply(undefined, _toConsumableArray(config.directives))(t);
		}
	};
};
exports.View = View;