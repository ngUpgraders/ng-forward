'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

var _expect = require('chai');

var _Controller = require('./controller');

var _Module = require('../module/module');

describe('@Controller annotation', function () {
	it('should decorate a class with $provider meta data', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController);
			}

			var _MyController = MyController;
			MyController = _Controller.Controller(MyController) || MyController;
			return MyController;
		})();

		_expect.expect(MyController).to.have.property('$provider');
		_expect.expect(MyController.$provider.name).to.equal('MyController');
		_expect.expect(MyController.$provider.type).to.equal('controller');
	});

	it('should register a controller parser with the Module class', function () {
		var parser = _Module.Module.getParser('controller');

		_expect.expect(parser).to.exist;
	});

	it('should correctly parse a controller', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController2);
			}

			var _MyController2 = MyController;
			MyController = _Controller.Controller(MyController) || MyController;
			return MyController;
		})();

		var module = {
			controller: _sinon2['default'].spy()
		};

		var parser = _Module.Module.getParser('controller');

		parser(MyController, module);

		var name = module.controller.args[0][0];
		var controller = module.controller.args[0][1];

		_expect.expect(module.controller.called).to.be['true'];
		_expect.expect(name).to.equal('MyController');
		_expect.expect(controller).to.eql(MyController);
	});

	it('should define the $provider property on the prototype of the target', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController3);
			}

			var _MyController3 = MyController;
			MyController = _Controller.Controller(MyController) || MyController;
			return MyController;
		})();

		var NewController = (function (_MyController4) {
			function NewController() {
				_classCallCheck(this, _NewController);

				if (_MyController4 != null) {
					_MyController4.apply(this, arguments);
				}
			}

			_inherits(NewController, _MyController4);

			var _NewController = NewController;
			NewController = _Controller.Controller(NewController) || NewController;
			return NewController;
		})(MyController);

		_expect.expect(MyController.$provider.name).not.to.equal('NewController');
		_expect.expect(MyController.$provider.name).to.equal('MyController');
		_expect.expect(NewController.$provider.name).to.equal('NewController');
	});
});