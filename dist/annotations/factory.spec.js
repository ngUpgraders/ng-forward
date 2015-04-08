'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _expect = require('chai');

var _Factory = require('./factory');

var _Module = require('../module/module');

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

describe('@Factory Annotation', function () {
	it('should decorate a class with $provider meta information', function () {
		var ExampleClass = (function () {
			function ExampleClass() {
				_classCallCheck(this, ExampleClass);
			}

			ExampleClass = _Factory.Factory('MyFactory')(ExampleClass) || ExampleClass;
			return ExampleClass;
		})();

		_expect.expect(ExampleClass).to.have.property('$provider');
		_expect.expect(ExampleClass.$provider).to.have.property('name', 'MyFactory');
		_expect.expect(ExampleClass.$provider).to.have.property('type', 'factory');
	});

	describe('Parser', function () {
		var parser = undefined,
		    module = undefined;

		beforeEach(function () {
			module = { factory: _sinon2['default'].spy() };
			parser = _Module.Module.getParser('factory');
		});

		it('should register itself with Module', function () {
			_expect.expect(parser).to.be.defined;
		});

		it('should use the static create method on a class as the factory function', function () {
			var called = false;

			var ExampleClass = (function () {
				function ExampleClass() {
					_classCallCheck(this, ExampleClass);
				}

				_createClass(ExampleClass, null, [{
					key: 'create',
					value: function create() {
						called = true;
					}
				}]);

				ExampleClass = _Factory.Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);
			var factoryProvider = module.factory.args[0][1];

			factoryProvider()();

			_expect.expect(called).to.be['true'];
		});

		it('should pass dependencies to the create method', function () {
			var a = undefined,
			    b = undefined;

			var ExampleClass = (function () {
				function ExampleClass() {
					_classCallCheck(this, ExampleClass);
				}

				_createClass(ExampleClass, null, [{
					key: 'create',
					value: function create(dependencies) {
						a = dependencies[0];
						b = dependencies[1];
					}
				}]);

				ExampleClass = _Factory.Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);
			var factoryProvider = module.factory.args[0][1];

			factoryProvider(1, 2)();

			_expect.expect(a).to.equal(1);
			_expect.expect(b).to.equal(2);
		});

		it('should generate a factory function for a class', function () {
			var ExampleClass = (function () {
				function ExampleClass(depA, depB, depC, propA, propB, propC) {
					_classCallCheck(this, ExampleClass);

					this.depA = depA;
					this.depB = depB;
					this.depC = depC;

					this.propA = propA;
					this.propB = propB;
					this.propC = propC;
				}

				ExampleClass = _Factory.Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);

			var factoryName = module.factory.args[0][0];
			var factoryProvider = module.factory.args[0][1];
			_expect.expect(factoryName).to.equal('MyFactory');
			_expect.expect(factoryProvider).to.be.defined;

			var factory = factoryProvider('a', 'b', 'c');
			_expect.expect(factory).to.be.defined;

			var instance = factory('1', '2', '3');
			_expect.expect(instance).to.have.property('propA', '1');
			_expect.expect(instance).to.have.property('propB', '2');
			_expect.expect(instance).to.have.property('propC', '3');
		});
	});
});