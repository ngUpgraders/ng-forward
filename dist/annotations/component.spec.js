'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _component = require('./component');

var _utilTests = require('../util/tests');

var _utilTests2 = _interopRequireDefault(_utilTests);

describe('@Component annotation', function () {
	it('should decorate a class with the $provider and $component metadata', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = (0, _component.Component)({ selector: 'my-component' })(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.should.have.property('$provider');
		MyClass.should.have.property('$component');
	});

	it('should correctly add restrict : "E"', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = (0, _component.Component)({ selector: 'my-component' })(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.$component.should.have.property('restrict', 'E');
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
					MyClass = (0, _component.Component)({ selector: '[my-attr]' })(MyClass) || MyClass;
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
					MyClass = (0, _component.Component)({ selector: '.my-class' })(MyClass) || MyClass;
					return MyClass;
				})();
			})();
		} catch (e) {
			caughtClass = true;
		}

		caughtAttr.should.be.ok;
		caughtClass.should.be.ok;
	});

	it('should accept a binding property', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass5);
			}

			var _MyClass5 = MyClass;
			MyClass = (0, _component.Component)({
				selector: 'my-component',
				bind: { 'myAttr': '@' }
			})(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.$component.scope.should.have.property('myAttr', '@');
		MyClass.$component.bindToController.should.be.ok;
	});
});