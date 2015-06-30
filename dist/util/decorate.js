'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var d = {};

exports.d = d;

var D = (function () {
	function D() {
		_classCallCheck(this, D);

		this.decorators = [];
	}

	_createClass(D, [{
		key: 'for',
		value: function _for(target) {
			for (var i = 0; i < this.decorators.length; i++) {
				if (typeof this.decorators[i] !== 'function') {
					throw new TypeError('Decorator ' + (i + 1) + ' did not produce a function');
				}

				this.decorators[i](target);
			}

			this.decorators = [];
		}
	}]);

	return D;
})();

var register = function register(name, decorator) {
	Object.defineProperty(D.prototype, name, {
		get: function get() {
			this.decorators.push(decorator);
			return this;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(d, name, {
		get: function get() {
			return new D()[name];
		},
		enumerable: true,
		configurable: true
	});
};

exports.register = register;
var registerFactory = function registerFactory(name, decoratorFactory) {
	D.prototype[name] = function () {
		for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
			params[_key] = arguments[_key];
		}

		this.decorators.push(decoratorFactory.apply(undefined, params));
		return this;
	};

	d[name] = function () {
		var _ref;

		for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			params[_key2] = arguments[_key2];
		}

		return (_ref = new D())[name].apply(_ref, params);
	};
};
exports.registerFactory = registerFactory;