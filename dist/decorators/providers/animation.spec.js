'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _animation = require('./animation');

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _writers = require('../../writers');

var _testsFrameworks = require('../../tests/frameworks');

describe('@Animation Decorator', function () {
	it('should set the correct provider name and type', function () {
		var MyClassAnimation = (function () {
			function MyClassAnimation() {
				_classCallCheck(this, _MyClassAnimation);
			}

			var _MyClassAnimation = MyClassAnimation;
			MyClassAnimation = (0, _animation.Animation)('.my-class')(MyClassAnimation) || MyClassAnimation;
			return MyClassAnimation;
		})();

		_writers.providerWriter.get('type', MyClassAnimation).should.eql('animation');
		_writers.providerWriter.get('name', MyClassAnimation).should.eql('.my-class');
	});

	it('should throw an error if you do not provide a class name', function () {
		var test = function test() {
			var MyAnimation = (function () {
				function MyAnimation() {
					_classCallCheck(this, _MyAnimation);
				}

				var _MyAnimation = MyAnimation;
				MyAnimation = (0, _animation.Animation)(MyAnimation) || MyAnimation;
				return MyAnimation;
			})();
		};

		test.should['throw'](Error, /must be supplied with the name of a class/);
	});

	it('should throw an error if the class selector is invalid', function () {
		var element = function element() {
			var Element = (function () {
				function Element() {
					_classCallCheck(this, _Element);
				}

				var _Element = Element;
				Element = (0, _animation.Animation)('my-class')(Element) || Element;
				return Element;
			})();
		};

		var attr = function attr() {
			var Attr = (function () {
				function Attr() {
					_classCallCheck(this, _Attr);
				}

				var _Attr = Attr;
				Attr = (0, _animation.Animation)('[my-class]')(Attr) || Attr;
				return Attr;
			})();
		};

		element.should['throw'](Error, /Invalid selector passed/);
		attr.should['throw'](Error, /Invalid selector passed/);
	});

	describe('Parser', function () {
		var parser = undefined,
		    module = undefined;

		beforeEach(function () {
			parser = _module3['default'].getParser('animation');
			module = { animation: _testsFrameworks.sinon.spy() };
		});

		it('should add a parser to Module', function () {
			parser.should.be.defined;
		});

		it('should correctly register a new animation', function () {
			parser(function () {}, 'Test', [], module);

			module.animation.should.have.been.called;
		});
	});
});