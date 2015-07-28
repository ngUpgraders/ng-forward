/*global beforeEach, it, describe */
'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _testsFrameworks = require('../../tests/frameworks');

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _writers = require('../../writers');

var _controller = require('./controller');

describe('@Controller annotation', function () {
	beforeEach(function () {
		return _controller.Controller.clearNameCache();
	});

	it('should decorate a class with $provider meta data', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController);
			}

			var _MyController = MyController;
			MyController = (0, _controller.Controller)(MyController) || MyController;
			return MyController;
		})();

		_writers.providerWriter.get('type', MyController).should.eql('controller');
		_writers.providerWriter.get('name', MyController).should.eql('MyController');
	});

	it('should register a controller parser with the Module class', function () {
		var parser = _module3['default'].getParser('controller');

		parser.should.exist;
	});

	it('should correctly parse a controller', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController2);
			}

			var _MyController2 = MyController;
			MyController = (0, _controller.Controller)(MyController) || MyController;
			return MyController;
		})();

		var module = {
			controller: _testsFrameworks.sinon.spy()
		};

		var parser = _module3['default'].getParser('controller');

		parser(MyController, 'MyController', [], module);

		var name = module.controller.args[0][0];
		var controller = module.controller.args[0][1];

		module.controller.called.should.be['true'];
		name.should.equal('MyController');
		controller.should.eql([MyController]);
	});

	it('should define the $provider property on the prototype of the target', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController3);
			}

			var _MyController3 = MyController;
			MyController = (0, _controller.Controller)(MyController) || MyController;
			return MyController;
		})();

		var NewController = (function (_MyController4) {
			_inherits(NewController, _MyController4);

			function NewController() {
				_classCallCheck(this, _NewController);

				_get(Object.getPrototypeOf(_NewController.prototype), 'constructor', this).apply(this, arguments);
			}

			var _NewController = NewController;
			NewController = (0, _controller.Controller)(NewController) || NewController;
			return NewController;
		})(MyController);

		_writers.providerWriter.get('name', MyController).should.not.equal('NewController');
		_writers.providerWriter.get('name', MyController).should.equal('MyController');
		_writers.providerWriter.get('name', NewController).should.equal('NewController');
	});
});