'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Transclude = require('./transclude');

var _chai = require('../util/tests');

var _chai2 = _interopRequireWildcard(_chai);

describe('@Transclude annotation', function () {
	it('should decorate a function with the $component object', function () {
		var MyComponent = (function () {
			function MyComponent() {
				_classCallCheck(this, _MyComponent);
			}

			var _MyComponent = MyComponent;
			MyComponent = _Transclude.Transclude(MyComponent) || MyComponent;
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
			MyClass = _Transclude.Transclude(MyClass) || MyClass;
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
			MyComponent = _Transclude.Transclude('element')(MyComponent) || MyComponent;
			return MyComponent;
		})();

		MyComponent.$component.transclude.should.eql('element');
	});
});