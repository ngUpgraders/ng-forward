'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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
				_classCallCheck(this, MyController);
			}

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
				_classCallCheck(this, MyController);
			}

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
});