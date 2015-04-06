'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _parsers = {};

var Module = (function () {
	function Module(name) {
		var modules = arguments[1] === undefined ? false : arguments[1];

		_classCallCheck(this, Module);

		this.name = name;

		if (modules) {
			this._module = angular.module(name, modules);
		} else {
			this._module = angular.module(name);
		}
	}

	_createClass(Module, [{
		key: 'add',
		value: function add() {
			for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
				providers[_key] = arguments[_key];
			}

			for (var i = 0; i < providers.length; i++) {
				var parser = _parsers[providers[i].$provider.type];

				parser(providers[i], this._module);
			}
		}
	}, {
		key: 'bootstrap',
		value: function bootstrap() {
			if (!this.bundled) this.bundle();
		}
	}, {
		key: 'publish',
		value: function publish() {
			return this._module;
		}
	}], [{
		key: 'moduleList',
		value: function moduleList(modules) {
			var realModuleList = [];

			if (modules) {
				for (var i = 0; i < modules.length; i++) {
					if (modules[i].name) {
						realModuleList.push(modules[i].name);
					} else if (typeof modules[i] == 'string') {
						realModuleList.push(modules[i]);
					} else {
						throw new Error('Cannot create submodule: unknown module type');
					}
				}
			}

			return realModuleList;
		}
	}, {
		key: 'registerProvider',
		value: function registerProvider(providerType, parser) {
			_parsers[providerType] = parser;
		}
	}, {
		key: 'getParser',
		value: function getParser(providerType) {
			return _parsers[providerType];
		}
	}]);

	return Module;
})();

exports.Module = Module;