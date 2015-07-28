'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _writers = require('./writers');

var _parsers = {};

var DecoratedModule = (function () {
	function DecoratedModule(name) {
		var modules = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		_classCallCheck(this, DecoratedModule);

		this.name = name;
		this.moduleList(modules);

		if (modules) {
			this._module = angular.module(name, this._dependencies);
		} else {
			this._module = angular.module(name);
		}
	}

	_createClass(DecoratedModule, [{
		key: 'add',
		value: function add() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
					providers[_key] = arguments[_key];
				}

				for (var _iterator = providers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var provider = _step.value;

					if (!_writers.providerWriter.has('type', provider)) {
						throw new Error('Cannot read provider metadata. Are you adding a class that hasn\'t been decorated yet?');
					}

					var type = _writers.providerWriter.get('type', provider);
					var _name = _writers.providerWriter.get('name', provider);
					var inject = _writers.baseWriter.get('$inject', provider) || [];

					if (_parsers[type]) {
						_parsers[type](provider, _name, inject, this._module);
					} else {
						throw new Error('No parser registered for type \'' + type + '\'');
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return this;
		}
	}, {
		key: 'publish',
		value: function publish() {
			return this._module;
		}
	}, {
		key: 'moduleList',
		value: function moduleList(modules) {
			this._dependencies = [];

			if (modules && modules.length !== 0) {
				for (var i = 0; i < modules.length; i++) {
					if (modules[i] && modules[i].name) {
						this._dependencies.push(modules[i].name);
					} else if (typeof modules[i] === 'string') {
						this._dependencies.push(modules[i]);
					} else {
						throw new Error('Cannot read module: Unknown module in ' + this.name);
					}
				}
			}
		}
	}, {
		key: 'config',
		value: function config(configFunc) {
			this._module.config(configFunc);

			return this;
		}
	}, {
		key: 'run',
		value: function run(runFunc) {
			this._module.run(runFunc);

			return this;
		}
	}, {
		key: 'value',
		value: function value() {
			var _module2;

			(_module2 = this._module).value.apply(_module2, arguments);

			return this;
		}
	}, {
		key: 'constant',
		value: function constant() {
			var _module3;

			(_module3 = this._module).constant.apply(_module3, arguments);

			return this;
		}
	}]);

	return DecoratedModule;
})();

function Module() {
	for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		params[_key2] = arguments[_key2];
	}

	return new (_bind.apply(DecoratedModule, [null].concat(params)))();
}

Module.addProvider = function (providerType, parser) {
	_parsers[providerType] = parser;
};

Module.getParser = function (providerType) {
	return _parsers[providerType];
};

exports['default'] = Module;
module.exports = exports['default'];