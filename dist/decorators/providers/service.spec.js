'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _service = require('./service');

var _testsFrameworks = require('../../tests/frameworks');

var _writers = require('../../writers');

describe('@Service Decorator', function () {
	it('should decorate a class with a provider name and type', function () {
		var MyService = (function () {
			function MyService() {
				_classCallCheck(this, _MyService);
			}

			var _MyService = MyService;
			MyService = (0, _service.Service)(MyService) || MyService;
			return MyService;
		})();

		_writers.providerWriter.get('type', MyService).should.eql('service');
		_writers.providerWriter.get('name', MyService).should.eql('MyService');
	});

	it('should adhere to inheritance', function () {
		var BaseClass = (function () {
			function BaseClass() {
				_classCallCheck(this, _BaseClass);
			}

			var _BaseClass = BaseClass;
			BaseClass = (0, _service.Service)(BaseClass) || BaseClass;
			return BaseClass;
		})();

		var MyClass = (function (_BaseClass2) {
			_inherits(MyClass, _BaseClass2);

			function MyClass() {
				_classCallCheck(this, _MyClass);

				_get(Object.getPrototypeOf(_MyClass.prototype), 'constructor', this).apply(this, arguments);
			}

			var _MyClass = MyClass;
			MyClass = (0, _service.Service)(MyClass) || MyClass;
			return MyClass;
		})(BaseClass);

		_writers.providerWriter.get('name', BaseClass).should.eql('BaseClass');
		_writers.providerWriter.get('name', MyClass).should.eql('MyClass');
	});

	it('should let you specify a name for the service', function () {
		var BaseClass = (function () {
			function BaseClass() {
				_classCallCheck(this, _BaseClass3);
			}

			var _BaseClass3 = BaseClass;
			BaseClass = (0, _service.Service)('Renamed')(BaseClass) || BaseClass;
			return BaseClass;
		})();

		_writers.providerWriter.get('name', BaseClass).should.eql('Renamed');
	});

	describe('Parser', function () {
		var parser = undefined,
		    module = undefined;

		beforeEach(function () {
			parser = _module3['default'].getParser('service');
			module = {
				service: _testsFrameworks.sinon.spy()
			};
		});

		it('should register itself with Module', function () {
			parser.should.be.defined;
		});

		it('should parse an annotated class into an ng service', function () {
			var MyService = (function () {
				function MyService() {
					_classCallCheck(this, _MyService2);
				}

				var _MyService2 = MyService;
				MyService = (0, _service.Service)(MyService) || MyService;
				return MyService;
			})();

			parser(MyService, 'MyService', [], module);

			module.service.should.have.been.calledWith('MyService', [MyService]);
		});
	});
});