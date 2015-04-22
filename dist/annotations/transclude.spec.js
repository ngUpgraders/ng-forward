'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Transclude = require('./transclude');

var _expect = require('chai');

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

		_expect.expect(MyComponent).to.have.property('$component');
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

		_expect.expect(MyClass.$component.transclude).to.be.ok;
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

		_expect.expect(MyComponent.$component.transclude).to.eql('element');
	});
});