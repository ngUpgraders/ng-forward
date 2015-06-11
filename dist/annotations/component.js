'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _utilDecorateDirective = require('../util/decorate-directive');

var _utilParseComponentSelector = require('../util/parse-component-selector');

var Component = function Component(options) {
	return function (t) {
		if (!options.selector) throw new Error('Must provide a selector');
		var info = (0, _utilParseComponentSelector.parseComponentSelector)(options.selector);

		(0, _utilDecorateDirective.decorateDirective)(t, info.name, info.type, options.bind, options.controllerAs);

		if (info.type !== 'E') {
			throw new Error('Components must be elements. Maybe you meant Decorator?');
		}
	};
};
exports.Component = Component;