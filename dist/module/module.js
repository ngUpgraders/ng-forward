'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _parsers = {};

var Module = (function () {
	function Module(name, modules) {
		_classCallCheck(this, Module);

		this.$es6 = true;
		this.name = name;
		this.modules = Module.moduleList(modules);
		this.providers = [];
		this.bundled = false;
	}

	_createClass(Module, [{
		key: 'register',
		value: function register() {
			for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
				providers[_key] = arguments[_key];
			}

			if (!this.bundled) {
				var _providers;

				(_providers = this.providers).push.apply(_providers, providers);
			} else {
				throw new Error('' + this.name + ' has already been bundled');
			}

			return this;
		}
	}, {
		key: 'publish',
		value: function publish() {
			return this.bundle();
		}
	}, {
		key: 'bundle',
		value: function bundle() {
			if (!this.bundled) {
				var _module2 = angular.module(this.name, this.modules);
				console.log(this.providers);

				for (var i = 0; i < this.providers.length; i++) {

					var parser = _parsers[this.providers[i].$provider.type];

					parser(this.providers[i], _module2);
				}

				this.bundled = true;

				return _module2;
			} else {
				throw new Error('' + this.name + ' has already been bundled');
			}
		}
	}, {
		key: 'bootstrap',
		value: function bootstrap() {
			if (!this.bundled) this.bundle();
		}
	}], [{
		key: 'addToExisting',
		value: function addToExisting(module) {
			for (var _len2 = arguments.length, providers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				providers[_key2 - 1] = arguments[_key2];
			}

			for (var i = 0; i < providers.length; i++) {
				var parser = _parsers[providers[i].$provider.type];

				parser(providers[i], module);
			}

			return module;
		}
	}, {
		key: 'moduleList',
		value: function moduleList(modules) {
			var realModuleList = [];

			if (modules) {
				for (var i = 0; i < modules.length; i++) {
					if (modules[i].$es6) {
						var bundled = modules[i].bundle();

						realModuleList.push(bundled.name);
					} else if (modules[i].name) {
						realModuleList.push(module.name);
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
	}]);

	return Module;
})();

exports.Module = Module;