'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilDecorateDirective = require('../../util/decorate-directive');

var _utilDecorateDirective2 = _interopRequireDefault(_utilDecorateDirective);

var _utilParseSelector = require('../../util/parse-selector');

var _utilParseSelector2 = _interopRequireDefault(_utilParseSelector);

var _writers = require('../../writers');

var TYPE = 'directive';

var Directive = function Directive(config) {
	return function (t) {
		if (!config.selector) {
			throw new Error('Directive selector must be provided');
		}

		var _parseSelector = (0, _utilParseSelector2['default'])(config.selector);

		var name = _parseSelector.name;
		var type = _parseSelector.type;

		if (type === 'E') {
			throw new Error('Directives cannot be elements. Perhaps you meant to use @Component?');
		}

		_writers.providerWriter.set('name', name, t);
		_writers.providerWriter.set('type', TYPE, t);

		// Sensible defaults for attribute directives
		_writers.componentWriter.set('scope', false, t);
		_writers.componentWriter.set('restrict', type);

		(0, _utilDecorateDirective2['default'])(config, t);
	};
};
exports.Directive = Directive;