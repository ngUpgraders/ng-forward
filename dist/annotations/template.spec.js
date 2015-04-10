'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Template = require('./template');

var _expect = require('chai');

describe('@Template Annotation', function () {
	it('should add a template option to a component', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = _Template.Template({ inline: 'test' })(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass).to.have.property('$component');
		_expect.expect(MyClass.$component).to.have.property('template');
	});

	it('should support inline templates', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = _Template.Template({ inline: 'test' })(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass.$component).to.have.property('template', 'test');
	});

	it('should support template URLs', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass3);
			}

			var _MyClass3 = MyClass;
			MyClass = _Template.Template({ url: '/path/to/it' })(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass.$component).to.have.property('templateUrl', '/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass4);
			}

			var _MyClass4 = MyClass;
			MyClass = _Template.Template({ inline: 'test' })(MyClass) || MyClass;
			return MyClass;
		})();

		var NewClass = (function (_MyClass5) {
			function NewClass() {
				_classCallCheck(this, _NewClass);

				if (_MyClass5 != null) {
					_MyClass5.apply(this, arguments);
				}
			}

			_inherits(NewClass, _MyClass5);

			var _NewClass = NewClass;
			NewClass = _Template.Template({ url: '/path/to/it' })(NewClass) || NewClass;
			return NewClass;
		})(MyClass);

		var TestClass = (function (_NewClass2) {
			function TestClass() {
				_classCallCheck(this, _TestClass);

				if (_NewClass2 != null) {
					_NewClass2.apply(this, arguments);
				}
			}

			_inherits(TestClass, _NewClass2);

			var _TestClass = TestClass;
			TestClass = _Template.Template({ inline: 'new test' })(TestClass) || TestClass;
			return TestClass;
		})(NewClass);

		_expect.expect(MyClass.$component).to.have.property('template', 'test');
		_expect.expect(NewClass.$component).to.have.property('templateUrl', '/path/to/it');
		_expect.expect(NewClass.$component).not.to.have.property('template');
		_expect.expect(TestClass.$component).to.have.property('template', 'new test');
		_expect.expect(TestClass.$component).not.to.have.property('templateUrl');
	});
});