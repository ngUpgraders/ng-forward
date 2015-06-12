'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilTests = require('../util/tests');

var _utilTests2 = _interopRequireDefault(_utilTests);

xdescribe('@Transclude annotation', function () {
	it('should decorate a function with the $component object', function () {
		var MyComponent = (function () {
			function MyComponent() {
				_classCallCheck(this, _MyComponent);
			}

			var _MyComponent = MyComponent;
			MyComponent = Transclude(MyComponent) || MyComponent;
			return MyComponent;
		})();

		MyComponent.should.have.property('$component');
	});

	it('should set transclude to true on the $component', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = Transclude(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.$component.transclude.should.be.ok;
	});

	it('should set transclude to a string if a string was provided to the annotation', function () {
		var MyComponent = (function () {
			function MyComponent() {
				_classCallCheck(this, _MyComponent2);
			}

			var _MyComponent2 = MyComponent;
			MyComponent = Transclude('element')(MyComponent) || MyComponent;
			return MyComponent;
		})();

		MyComponent.$component.transclude.should.eql('element');
	});
});