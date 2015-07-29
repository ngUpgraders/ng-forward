'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _writers = require('../../writers');

var _utilParseSelector = require('../../util/parse-selector');

var _utilParseSelector2 = _interopRequireDefault(_utilParseSelector);

var _utilStrategy = require('../../util/strategy');

var _utilStrategy2 = _interopRequireDefault(_utilStrategy);

var TYPE = 'animation';

var Animation = function Animation(className) {
	if (typeof className !== 'string') {
		throw new Error('@Animation must be supplied with the name of a class: @Animation(\'.my-animation\'');
	}

	var _parseSelector = (0, _utilParseSelector2['default'])(className);

	var type = _parseSelector.type;

	if (type !== 'C') {
		throw new Error('Invalid selector passed to @Animation: ' + className + ' is not a class selector');
	}

	return function (target) {

		_writers.providerWriter.set('type', TYPE, target);
		_writers.providerWriter.set('name', className, target);
		(0, _utilStrategy2['default'])('animation', target);
	};
};

exports.Animation = Animation;
_module3['default'].addProvider(TYPE, function (provider, name, injects, ngModule) {
	ngModule.animation(name, [].concat(_toConsumableArray(injects), [function () {
		for (var _len = arguments.length, depends = Array(_len), _key = 0; _key < _len; _key++) {
			depends[_key] = arguments[_key];
		}

		return new (_bind.apply(provider, [null].concat(depends)))();
	}]));
});