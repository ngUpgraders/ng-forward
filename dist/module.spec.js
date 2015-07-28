'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _testsFrameworks = require('./tests/frameworks');

var _testsAngular = require('./tests/angular');

var _writers = require('./writers');

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var provider = function provider(type, name) {
	return function (t) {
		_writers.providerWriter.set('type', type, t);
		_writers.providerWriter.set('name', name, t);
	};
};

describe('Decorator Supported Module', function () {
	it('should let you create an Angular module', function () {
		var module = (0, _module3['default'])('test', []);

		module.should.be.defined;
		_testsAngular.ng.module.should.have.been.called;
	});

	it('should let you publish the module to gain access to the ng module', function () {
		(0, _module3['default'])('test', []).publish().should.eql(_testsAngular.ngMocks);
	});

	it('should let you config the module', function () {
		var config = ['$q', function () {}];
		(0, _module3['default'])('test', []).config(config);

		_testsAngular.ngMocks.config.should.have.been.calledWith(config);
	});

	it('should let you create a run function', function () {
		var run = ['$q', function () {}];
		(0, _module3['default'])('test', []).run(run);

		_testsAngular.ngMocks.run.should.have.been.calledWith(run);
	});

	it('should let you add value to the module', function () {
		var value = 'testValue';
		(0, _module3['default'])('test', []).value('test', value);

		_testsAngular.ngMocks.value.should.have.been.calledWith('test', value);
	});

	it('should let you add constant to the module', function () {
		var value = 'constantValue';
		(0, _module3['default'])('test', []).constant('TEST', value);

		_testsAngular.ngMocks.constant.should.have.been.calledWith('TEST', value);
	});

	describe('Adding providers', function () {
		var exampleRegister = undefined;

		beforeEach(function () {
			exampleRegister = _testsFrameworks.sinon.spy();
			_module3['default'].addProvider('example', exampleRegister);
		});

		it('should let you add providers', function () {
			var A = (function () {
				function A() {
					_classCallCheck(this, _A);
				}

				var _A = A;
				A = provider('example', 'A')(A) || A;
				return A;
			})();

			var mod = (0, _module3['default'])('test', []).add(A);

			exampleRegister.should.have.been.calledWith(A, 'A', [], mod.publish());
		});

		it('should let you add multiple providers', function () {
			var A = (function () {
				function A() {
					_classCallCheck(this, _A2);
				}

				var _A2 = A;
				A = provider('example', 'A')(A) || A;
				return A;
			})();

			var B = (function () {
				function B() {
					_classCallCheck(this, _B);
				}

				var _B = B;
				B = provider('example', 'B')(B) || B;
				return B;
			})();

			var C = (function () {
				function C() {
					_classCallCheck(this, _C);
				}

				var _C = C;
				C = provider('example', 'C')(C) || C;
				return C;
			})();

			(0, _module3['default'])('test', []).add(A, B, C);

			exampleRegister.should.have.been.calledThrice;
		});

		it('should throw an error if you add provider with no decorators', function () {
			var A = function A() {
				_classCallCheck(this, A);
			};

			var test = function test() {
				return (0, _module3['default'])('test', []).add(A);
			};

			test.should['throw'](Error, /Cannot read provider/);
		});

		it('should throw an error when adding a provider with an unrecognized type', function () {
			var A = (function () {
				function A() {
					_classCallCheck(this, _A3);
				}

				var _A3 = A;
				A = provider('dne', 'A')(A) || A;
				return A;
			})();

			var test = function test() {
				return (0, _module3['default'])('test', []).add(A);
			};

			test.should['throw'](Error, /No parser registered/);
		});
	});
});

describe('Integration: Module', function () {
	var angular = undefined;

	beforeEach(function () {
		angular = _testsAngular.ng.useReal();
	});

	it('should let you create an Angular module', function () {
		var module = (0, _module3['default'])('test', []);
		angular.module('test').should.be.equal(module.publish());
	});
});