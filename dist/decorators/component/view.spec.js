'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _view = require('./view');

require('../../tests/frameworks');

var _writers = require('../../writers');

describe('@View Decorator', function () {
	it('should add a template option to a component', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = (0, _view.View)({ template: 'test' })(MyClass) || MyClass;
			return MyClass;
		})();

		_writers.componentWriter.get('template', MyClass).should.eql('test');
	});

	it('should support template URLs', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = (0, _view.View)({ templateUrl: '/path/to/it' })(MyClass) || MyClass;
			return MyClass;
		})();

		_writers.componentWriter.get('templateUrl', MyClass).should.eql('/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function () {
		var Parent = (function () {
			function Parent() {
				_classCallCheck(this, _Parent);
			}

			var _Parent = Parent;
			Parent = (0, _view.View)({ template: 'test' })(Parent) || Parent;
			return Parent;
		})();

		var Child = (function (_Parent2) {
			_inherits(Child, _Parent2);

			function Child() {
				_classCallCheck(this, _Child);

				_get(Object.getPrototypeOf(_Child.prototype), 'constructor', this).apply(this, arguments);
			}

			var _Child = Child;
			Child = (0, _view.View)({ templateUrl: '/path/to/it' })(Child) || Child;
			return Child;
		})(Parent);

		var GrandChild = (function (_Child2) {
			_inherits(GrandChild, _Child2);

			function GrandChild() {
				_classCallCheck(this, _GrandChild);

				_get(Object.getPrototypeOf(_GrandChild.prototype), 'constructor', this).apply(this, arguments);
			}

			var _GrandChild = GrandChild;
			GrandChild = (0, _view.View)({ template: 'new test' })(GrandChild) || GrandChild;
			return GrandChild;
		})(Child);

		_writers.componentWriter.get('template', Parent).should.eql('test');
		_writers.componentWriter.get('templateUrl', Child).should.eql('/path/to/it');
		(_writers.componentWriter.get('template', Child) === undefined).should.be['true'];
		_writers.componentWriter.get('template', GrandChild).should.eql('new test');
		(_writers.componentWriter.get('templateUrl', GrandChild) === undefined).should.be['true'];
	});
});