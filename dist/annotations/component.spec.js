'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Component = require('./component');

var _expect = require('chai');

describe('@Component annotation', function () {
	it('should decorate a class with the $provider and $component metadata', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = _Component.Component({ selector: 'my-component' })(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass).to.have.property('$provider');
		_expect.expect(MyClass).to.have.property('$component');
	});

	it('should correctly add restrict : "E"', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = _Component.Component({ selector: 'my-component' })(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass.$component).to.have.property('restrict', 'E');
	});

	it('should throw an error if the selector is not an element', function () {
		var caughtAttr = false;
		var caughtClass = false;

		try {
			(function () {
				var MyClass = (function () {
					function MyClass() {
						_classCallCheck(this, _MyClass3);
					}

					var _MyClass3 = MyClass;
					MyClass = _Component.Component({ selector: '[my-attr]' })(MyClass) || MyClass;
					return MyClass;
				})();
			})();
		} catch (e) {
			caughtAttr = true;
		}

		try {
			(function () {
				var MyClass = (function () {
					function MyClass() {
						_classCallCheck(this, _MyClass4);
					}

					var _MyClass4 = MyClass;
					MyClass = _Component.Component({ selector: '.my-class' })(MyClass) || MyClass;
					return MyClass;
				})();
			})();
		} catch (e) {
			caughtClass = true;
		}

		_expect.expect(caughtAttr).to.be.ok;
		_expect.expect(caughtClass).to.be.ok;
	});

	it('should accept a binding property', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass5);
			}

			var _MyClass5 = MyClass;
			MyClass = _Component.Component({
				selector: 'my-component',
				bind: { myAttr: '@' }
			})(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass.$component.scope).to.have.property('myAttr', '@');
		_expect.expect(MyClass.$component.bindToController).to.be.ok;
	});
});