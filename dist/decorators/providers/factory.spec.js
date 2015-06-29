// import {Factory} from './factory';
// import {Module} from '../module/module';
// import {sinon} from '../util/tests';
// import {hasMeta, getMeta} from '../util/metadata';

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

xdescribe('@Factory Annotation', function () {
	it('should decorate a class with $provider meta information', function () {
		var ExampleClass = (function () {
			function ExampleClass() {
				_classCallCheck(this, _ExampleClass);
			}

			var _ExampleClass = ExampleClass;
			ExampleClass = Factory('MyFactory')(ExampleClass) || ExampleClass;
			return ExampleClass;
		})();

		getMeta('$provider', ExampleClass).should.eql({
			name: 'MyFactory',
			type: 'factory'
		});
	});

	describe('Parser', function () {
		var parser = undefined,
		    module = undefined;

		beforeEach(function () {
			module = { factory: sinon.spy() };
			parser = Module.getParser('factory');
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

				ExampleClass = Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);
			var factoryProvider = module.factory.args[0][1][0];

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
						var _dependencies = _slicedToArray(dependencies, 2);

						a = _dependencies[0];
						b = _dependencies[1];
					}
				}]);

				ExampleClass = Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);
			var factoryProvider = module.factory.args[0][1][0];

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
				ExampleClass = Factory('MyFactory')(ExampleClass) || ExampleClass;
				return ExampleClass;
			})();

			parser(ExampleClass, module);

			var factoryName = module.factory.args[0][0];
			var factoryProvider = module.factory.args[0][1][0];
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