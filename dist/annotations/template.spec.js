'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _template = require('./template');

var _utilTests = require('../util/tests');

var _utilTests2 = _interopRequireDefault(_utilTests);

describe('@Template Annotation', function () {
	it('should add a template option to a component', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = (0, _template.Template)({ inline: 'test' })(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.should.have.property('$component');
		MyClass.$component.should.have.property('template');
	});

	it('should support inline templates', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = (0, _template.Template)({ inline: 'test' })(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.$component.should.have.property('template', 'test');
	});

	it('should support template URLs', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass3);
			}

			var _MyClass3 = MyClass;
			MyClass = (0, _template.Template)({ url: '/path/to/it' })(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.$component.should.have.property('templateUrl', '/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass4);
			}

			var _MyClass4 = MyClass;
			MyClass = (0, _template.Template)({ inline: 'test' })(MyClass) || MyClass;
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
			NewClass = (0, _template.Template)({ url: '/path/to/it' })(NewClass) || NewClass;
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
			TestClass = (0, _template.Template)({ inline: 'new test' })(TestClass) || TestClass;
			return TestClass;
		})(NewClass);

		MyClass.$component.should.have.property('template', 'test');
		NewClass.$component.should.have.property('templateUrl', '/path/to/it');
		NewClass.$component.should.not.have.property('template');
		TestClass.$component.should.have.property('template', 'new test');
		TestClass.$component.should.not.have.property('templateUrl');
	});
});