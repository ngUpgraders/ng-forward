'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Factory = require('./factory');

var _Module = require('../module/module');

var _sinon = require('../util/tests');

describe('@Factory Annotation', function () {
	it('should decorate a class with $provider meta information', function () {
		var ExampleClass = (function () {
			function ExampleClass() {
				_classCallCheck(this, _ExampleClass);
			}

			var _ExampleClass = ExampleClass;
			ExampleClass = _Factory.Factory('MyFactory')(ExampleClass) || ExampleClass;
			return ExampleClass;
		})();

		ExampleClass.should.have.property('$provider');
		ExampleClass.$provider.should.have.property('name', 'MyFactory');
		ExampleClass.$provider.should.have.property('type', 'factory');
	});

	describe('Parser', function () {
		var parser = undefined,
		    module = undefined;

		beforeEach(function () {
			module = { factory: _sinon.sinon.spy() };
			parser = _Module.Module.getParser('factory');
		});

		it('should register itself with Module', function () {
			parser.should.be.defined;
		});

		it('should use the static create method on a class as the factory function', function () {
			var called = false;

			var ExampleClass = (function () {
				function ExampleClass() {
					_classCallCheck(this, _ExampleClass2);
				}

				var _ExampleClass2 = ExampleClass;

				_createClass(_ExampleClass2, null, [{
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

			called.should.be['true'];
		});

		it('should pass dependencies to the create method', function () {
			var a = undefined,
			    b = undefined;

			var ExampleClass = (function () {
				function ExampleClass() {
					_classCallCheck(this, _ExampleClass3);
				}

				var _ExampleClass3 = ExampleClass;

				_createClass(_ExampleClass3, null, [{
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

			a.should.equal(1);
			b.should.equal(2);
		});

		it('should generate a factory function for a class', function () {
			var ExampleClass = (function () {
				function ExampleClass(depA, depB, depC, propA, propB, propC) {
					_classCallCheck(this, _ExampleClass4);

					this.depA = depA;
					this.depB = depB;
					this.depC = depC;

					this.propA = propA;
					this.propB = propB;
					this.propC = propC;
				}

				var _ExampleClass4 = ExampleClass;
				ExampleClass = _Factory.Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);

			var factoryName = module.factory.args[0][0];
			var factoryProvider = module.factory.args[0][1];
			factoryName.should.equal('MyFactory');
			factoryProvider.should.be.defined;

			var factory = factoryProvider('a', 'b', 'c');
			factory.should.be.defined;

			var instance = factory('1', '2', '3');
			instance.should.have.property('propA', '1');
			instance.should.have.property('propB', '2');
			instance.should.have.property('propC', '3');
		});
	});
});