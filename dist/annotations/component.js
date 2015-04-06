'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _decorateDirective = require('../util/decorate-directive');

var _parseComponentSelector = require('../util/parse-component-selector');

var Component = function Component(options) {
	return function (t) {
		if (!options.selector) throw new Error('Must provide a selector');
		var info = _parseComponentSelector.parseComponentSelector(options.selector);

		_decorateDirective.decorateDirective(t, info.name, info.type, options.bind);

		if (info.type !== 'E') {
			throw new Error('Components must be elements. Maybe you meant Decorator?');
		}
	};
};
exports.Component = Component;