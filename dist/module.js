// # Module
// A thin wrapper around `angular.module` for transforming annotated classes into
// angular providers
//
// ## Setup
// Unless you are using a shim, all official distributions of Angular.js install
// `angular` on `window`. It is safe to assume it will always be there.
/* global angular */
// The core of the module system relies on special metadata writers. They write
// namespaced metadata to a class. Each writer is responsible for handling some
// subset of useful information
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _writers = require('./writers');

// A very simple map holding the parsers for each provider. More on this later.
var _parsers = {};

// ## DecoratedModule class
// Define the Module wrapper class.

var DecoratedModule = (function () {
	function DecoratedModule(name) {
		var modules = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		_classCallCheck(this, DecoratedModule);

		// The name of the angular module to create
		this.name = name;

		// `angular.module` works either by creating a new module via an array
		// of dependencies or by reference without the dependencies array
		if (modules) {
			// parse the module list to create an array of just strings
			this.moduleList(modules);
			// Create the angular module.
			this._module = angular.module(name, this._dependencies);
		} else {
			// If no dependencies were passed, access the module by reference
			this._module = angular.module(name);
		}
	}

	// Becuase I determined `export default new Module` to be too long, wrap the
	// `DecoratedModule` class in a simple factory function.

	// This is where you add an annotated class to the Angular module

	_createClass(DecoratedModule, [{
		key: 'add',
		value: function add() {
			// We used a rest parameter so that you can add multiple providers at once.
			// So we must iterate over our array of providers.
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
					providers[_key] = arguments[_key];
				}

				for (var _iterator = providers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var provider = _step.value;

					// The providerWriter contains the type of provider the class will be transformed
					// into as well as the name of the eventual provider. If this information has
					// not been set on the class, then we aren't dealing with a decorated class.
					if (!_writers.providerWriter.has('type', provider)) {
						throw new Error('Cannot read provider metadata. Are you adding a class that hasn\'t been decorated yet?');
					}

					// Grab the type of provider
					var type = _writers.providerWriter.get('type', provider);
					// ...and the name of the provider
					var _name = _writers.providerWriter.get('name', provider);
					// This is the injection array used by angular's `$injector.invoke`. This array
					// is just a list of strings that will be injected
					var inject = _writers.appWriter.get('$inject', provider) || [];

					// We use the provider type to determine which parser will handle the class
					if (_parsers[type]) {
						// Execute the parser passing the class, name of the provider, injection
						// array, and the raw `angular.module` we defined in the constructor.
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

		// Dead code from angular-decorators that should probably be removed. Just returns
		// the raw angular.module.
	}, {
		key: 'publish',
		value: function publish() {
			return this._module;
		}

		// Parses the array of modules
	}, {
		key: 'moduleList',
		value: function moduleList(modules) {
			// Setup the dependency array
			this._dependencies = [];

			if (modules && modules.length !== 0) {
				// Iterate over the modules. Would be better done via `modules.map`, but
				// it works.
				for (var i = 0; i < modules.length; i++) {
					// If the module is a string (i.e. 'ui-router' or 'ngAria') then we are
					// already set
					if (typeof modules[i] === 'string') {
						this._dependencies.push(modules[i]);
					}
					// If it isn't a string but has a name then use the name instead. Raw
					// `angular.module`s provide the name here as does our reimplementation.
					else if (modules[i] && modules[i].name) {
							this._dependencies.push(modules[i].name);
						}
						// If neither case was met, throw an error
						else {
								throw new Error('Cannot read module: Unknown module in ' + this.name);
							}
				}
			}
		}

		// Alias over the raw config function
	}, {
		key: 'config',
		value: function config(configFunc) {
			this._module.config(configFunc);

			return this;
		}

		// Alias over the raw run function
	}, {
		key: 'run',
		value: function run(runFunc) {
			this._module.run(runFunc);

			return this;
		}

		// Alias for the value provider
	}, {
		key: 'value',
		value: function value() {
			var _module2;

			(_module2 = this._module).value.apply(_module2, arguments);

			return this;
		}

		// Alias for the constant provider
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

// A static function for adding new parsers. You pass it a type like 'factory' and
// a parsing function. This parsing function is what is called in the `DecoratedModule.add`
// function
Module.addProvider = function (providerType, parser) {
	_parsers[providerType] = parser;
};

// Retrieve a parser. Only useful for tests and checking if a parser has already been
// set
Module.getParser = function (providerType) {
	return _parsers[providerType];
};

// ## Conclusion
// Finally export module
exports['default'] = Module;
module.exports = exports['default'];