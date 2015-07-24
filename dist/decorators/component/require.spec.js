'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('./require');

var _writers = require('../../writers');

var _testsFrameworks = require('../../tests/frameworks');

describe('@Require Component Decorator', function () {
	it('should add the require DDO key to the target', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = (0, _require.Require)()(MyClass) || MyClass;
			return MyClass;
		})();

		_writers.componentWriter.has('require', MyClass).should.be.ok;
	});

	it('should set an array of requires as the value for the require key', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = (0, _require.Require)('a', 'b')(MyClass) || MyClass;
			return MyClass;
		})();

		Array.isArray(_writers.componentWriter.get('require', MyClass)).should.be.ok;
		_writers.componentWriter.get('require', MyClass).should.eql(['a', 'b']);
	});

	it('should respect inheritance', function () {
		var Parent = (function () {
			function Parent() {
				_classCallCheck(this, _Parent);
			}

			var _Parent = Parent;
			Parent = (0, _require.Require)('a')(Parent) || Parent;
			return Parent;
		})();

		var Child = (function (_Parent2) {
			_inherits(Child, _Parent2);

			function Child() {
				_classCallCheck(this, _Child);

				_get(Object.getPrototypeOf(_Child.prototype), 'constructor', this).apply(this, arguments);
			}

			var _Child = Child;
			Child = (0, _require.Require)('b')(Child) || Child;
			return Child;
		})(Parent);

		_writers.componentWriter.get('require', Child).should.eql(['a', 'b']);
	});
});