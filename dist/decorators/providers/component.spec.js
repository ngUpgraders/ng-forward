'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _component = require('./component');

require('../../tests/frameworks');

var _writers = require('../../writers');

describe('@Component annotation', function () {
	it('should decorate a class with correct $provider metadata', function () {
		var MyComponentCtrl = (function () {
			function MyComponentCtrl() {
				_classCallCheck(this, _MyComponentCtrl);
			}

			var _MyComponentCtrl = MyComponentCtrl;
			MyComponentCtrl = (0, _component.Component)({ selector: 'my-component' })(MyComponentCtrl) || MyComponentCtrl;
			return MyComponentCtrl;
		})();

		_writers.providerWriter.has('type', MyComponentCtrl).should.be.ok;
		_writers.providerWriter.get('type', MyComponentCtrl).should.eql('directive');
		_writers.providerWriter.has('name', MyComponentCtrl).should.be.ok;
		_writers.providerWriter.get('name', MyComponentCtrl).should.eql('myComponent');
	});

	it('should set sensible defaults using $component metadata', function () {
		var MyComponentCtrl = (function () {
			function MyComponentCtrl() {
				_classCallCheck(this, _MyComponentCtrl2);
			}

			var _MyComponentCtrl2 = MyComponentCtrl;
			MyComponentCtrl = (0, _component.Component)({ selector: 'my-component' })(MyComponentCtrl) || MyComponentCtrl;
			return MyComponentCtrl;
		})();

		_writers.componentWriter.get('restrict', MyComponentCtrl).should.eql('E');
		_writers.componentWriter.get('scope', MyComponentCtrl).should.eql({});
		_writers.componentWriter.get('bindToController', MyComponentCtrl).should.be.ok;
	});

	it('should throw an error if the selector is not an element', function () {
		var caughtAttr = false;
		var caughtClass = false;

		try {
			(function () {
				var MyClass = (function () {
					function MyClass() {
						_classCallCheck(this, _MyClass);
					}

					var _MyClass = MyClass;
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
						_classCallCheck(this, _MyClass2);
					}

					var _MyClass2 = MyClass;
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

	it('should respect inheritance', function () {
		var ParentCtrl = (function () {
			function ParentCtrl() {
				_classCallCheck(this, _ParentCtrl);
			}

			var _ParentCtrl = ParentCtrl;
			ParentCtrl = (0, _component.Component)({
				selector: 'parent',
				properties: ['@first', '=second']
			})(ParentCtrl) || ParentCtrl;
			return ParentCtrl;
		})();

		var ChildCtrl = (function (_ParentCtrl2) {
			function ChildCtrl() {
				_classCallCheck(this, _ChildCtrl);

				_get(Object.getPrototypeOf(_ChildCtrl.prototype), 'constructor', this).apply(this, arguments);
			}

			_inherits(ChildCtrl, _ParentCtrl2);

			var _ChildCtrl = ChildCtrl;
			ChildCtrl = (0, _component.Component)({ selector: 'child' })(ChildCtrl) || ChildCtrl;
			return ChildCtrl;
		})(ParentCtrl);

		_writers.componentWriter.get('bindToController', ChildCtrl).should.eql({
			first: '@',
			second: '='
		});
	});
});