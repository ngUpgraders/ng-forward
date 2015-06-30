'use strict';

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilTests = require('../../util/tests');

require('../../util/tests');

var _writers = require('../../writers');

var _controller = require('./controller');

describe('@Controller annotation', function () {
	xit('should decorate a class with $provider meta data', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController);
			}

			var _MyController = MyController;
			MyController = (0, _controller.Controller)(MyController) || MyController;
			return MyController;
		})();

		hasMeta('$provider', MyController).should.be.ok;
		getMeta('$provider', MyController).should.eql({
			name: 'MyController',
			type: 'controller'
		});
	});

	xit('should register a controller parser with the Module class', function () {
		var parser = Module.getParser('controller');

		parser.should.exist;
	});

	xit('should correctly parse a controller', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController2);
			}

			var _MyController2 = MyController;
			MyController = (0, _controller.Controller)(MyController) || MyController;
			return MyController;
		})();

		var module = {
			controller: _utilTests.sinon.spy()
		};

		var parser = Module.getParser('controller');

		parser(MyController, module);

		var name = module.controller.args[0][0];
		var controller = module.controller.args[0][1];

		module.controller.called.should.be['true'];
		name.should.equal('MyController');
		controller.should.eql([MyController]);
	});

	xit('should define the $provider property on the prototype of the target', function () {
		var MyController = (function () {
			function MyController() {
				_classCallCheck(this, _MyController3);
			}

			var _MyController3 = MyController;
			MyController = (0, _controller.Controller)(MyController) || MyController;
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
			NewController = (0, _controller.Controller)(NewController) || NewController;
			return NewController;
		})(MyController);

		getMeta('$provider', MyController).name.should.not.equal('NewController');
		getMeta('$provider', MyController).name.should.equal('MyController');
		getMeta('$provider', NewController).name.should.equal('NewController');
	});
});