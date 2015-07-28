'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _utilParseSelector = require('../../util/parse-selector');

var _utilParseSelector2 = _interopRequireDefault(_utilParseSelector);

var _utilDecorateDirective = require('../../util/decorate-directive');

var _utilDecorateDirective2 = _interopRequireDefault(_utilDecorateDirective);

var _writers = require('../../writers');

var _injectables = require('../injectables');

var TYPE = 'directive';

var Component = function Component(config) {
	return function (t) {
		if (!config.selector) {
			throw new Error('Component selector must be provided');
		}

		var _parseSelector = (0, _utilParseSelector2['default'])(config.selector);

		var name = _parseSelector.name;
		var restrict = _parseSelector.type;

		if (restrict !== 'E') {
			throw new Error('@Component selectors can only be elements. Perhaps you meant to use @Directive?');
		}

		_writers.providerWriter.set('name', name, t);
		_writers.providerWriter.set('type', TYPE, t);
		_writers.appWriter.set('selector', config.selector, t);

		var bindings = config.bindings || [];
		_injectables.Injectables.apply(undefined, _toConsumableArray(bindings))(t);

		// Sensible defaults for components
		if (!_writers.componentWriter.has('restrict', t)) {
			_writers.componentWriter.set('restrict', restrict, t);
		}
		if (!_writers.componentWriter.has('scope', t)) {
			_writers.componentWriter.set('scope', {}, t);
		}
		if (!_writers.componentWriter.has('bindToController', t)) {
			_writers.componentWriter.set('bindToController', true, t);
		}

		_writers.componentWriter.set('controllerAs', name, t);

		(0, _utilDecorateDirective2['default'])(config, t);
	};
};
exports.Component = Component;