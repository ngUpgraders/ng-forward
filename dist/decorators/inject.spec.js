'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _inject = require('./inject');

var _writers = require('../writers');

var _testsFrameworks = require('../tests/frameworks');

var _testsFrameworks2 = _interopRequireDefault(_testsFrameworks);

describe('@Inject annotation', function () {
	it('should decorate a function with the $inject array', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = (0, _inject.Inject)('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		_writers.baseWriter.has('$inject', MyClass).should.be.ok;
	});

	it('should add injected dependencies to the $inject array', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = (0, _inject.Inject)('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		_writers.baseWriter.get('$inject', MyClass).should.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass3);
			}

			var _MyClass3 = MyClass;
			MyClass = (0, _inject.Inject)('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		var SubClass = (function (_MyClass4) {
			function SubClass() {
				_classCallCheck(this, _SubClass);

				_get(Object.getPrototypeOf(_SubClass.prototype), 'constructor', this).apply(this, arguments);
			}

			_inherits(SubClass, _MyClass4);

			var _SubClass = SubClass;
			SubClass = (0, _inject.Inject)('d', 'e', 'f')(SubClass) || SubClass;
			return SubClass;
		})(MyClass);

		_writers.baseWriter.get('$inject', MyClass).should.eql(['a', 'b', 'c']);
		_writers.baseWriter.get('$inject', SubClass).should.eql(['d', 'e', 'f', 'a', 'b', 'c']);
	});
});