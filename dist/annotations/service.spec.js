'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _expect = require('chai');

var _Module = require('../module/module');

var _Service = require('./service');

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

describe('@Service Annotation', function () {
	it('should annotate a class', function () {
		var MyService = (function () {
			function MyService() {
				_classCallCheck(this, _MyService);
			}

			var _MyService = MyService;
			MyService = _Service.Service(MyService) || MyService;
			return MyService;
		})();

		_expect.expect(MyService).to.have.property('$provider');
		_expect.expect(MyService.$provider.name).to.equal('MyService');
		_expect.expect(MyService.$provider.type).to.equal('service');
	});

	it('should adhere to inheritance', function () {
		var BaseClass = (function () {
			function BaseClass() {
				_classCallCheck(this, _BaseClass);
			}

			var _BaseClass = BaseClass;
			BaseClass = _Service.Service(BaseClass) || BaseClass;
			return BaseClass;
		})();

		var MyClass = (function (_BaseClass2) {
			function MyClass() {
				_classCallCheck(this, _MyClass);

				if (_BaseClass2 != null) {
					_BaseClass2.apply(this, arguments);
				}
			}

			_inherits(MyClass, _BaseClass2);

			var _MyClass = MyClass;
			MyClass = _Service.Service(MyClass) || MyClass;
			return MyClass;
		})(BaseClass);

		_expect.expect(BaseClass.$provider.name).to.equal('BaseClass');
		_expect.expect(MyClass.$provider.name).to.equal('MyClass');
	});

	describe('Parser', function () {
		var parser = undefined,
		    module = undefined;

		beforeEach(function () {
			parser = _Module.Module.getParser('service');
			module = {
				service: _sinon2['default'].spy()
			};
		});

		it('should register itself with Module', function () {
			_expect.expect(parser).to.be.defined;
		});

		it('should parse an annotated class into an ng service', function () {
			var MyService = (function () {
				function MyService() {
					_classCallCheck(this, _MyService2);
				}

				var _MyService2 = MyService;
				MyService = _Service.Service(MyService) || MyService;
				return MyService;
			})();

			parser(MyService, module);

			var name = module.service.args[0][0];
			var service = module.service.args[0][1];

			_expect.expect(name).to.equal('MyService');
			_expect.expect(service).to.eql(MyService);
		});
	});
});