'use strict';

var _bind = Function.prototype.bind;

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _parsers = {};

var DecoratedModule = (function () {
	function DecoratedModule(name) {
		var modules = arguments[1] === undefined ? false : arguments[1];

		_classCallCheck(this, DecoratedModule);

		this.name = name;

		if (modules) {
			this._module = angular.module(name, Module.moduleList(modules));
		} else {
			this._module = angular.module(name);
		}
	}

	_createClass(DecoratedModule, [{
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
	}]);

	return DecoratedModule;
})();

function Module() {
	for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		params[_key2] = arguments[_key2];
	}

	return new (_bind.apply(DecoratedModule, [null].concat(params)))();
}

Module.moduleList = function (modules) {
	var realModuleList = [];

	if (modules) {
		for (var i = 0; i < modules.length; i++) {
			if (modules[i].name) {
				realModuleList.push(modules[i].name);
			} else if (typeof modules[i] === 'string') {
				realModuleList.push(modules[i]);
			} else {
				throw new Error('Cannot create submodule: unknown module type');
			}
		}
	}

	return realModuleList;
};

Module.registerProvider = function (providerType, parser) {
	_parsers[providerType] = parser;
};

Module.getParser = function (providerType) {
	return _parsers[providerType];
};

exports.Module = Module;