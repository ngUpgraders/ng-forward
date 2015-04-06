'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Inject = require('./inject');

var _expect = require('chai');

describe('@Inject annotation', function () {
	it('should decorate a function with the $inject array', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, MyClass);
			}

			MyClass = _Inject.Inject('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass).to.have.property('$inject');
	});

	it('should add injected dependencies to the $inject array', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, MyClass);
			}

			MyClass = _Inject.Inject('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		_expect.expect(MyClass.$inject).to.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, MyClass);
			}

			MyClass = _Inject.Inject('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		var SubClass = (function (_MyClass) {
			function SubClass() {
				_classCallCheck(this, SubClass);

				if (_MyClass != null) {
					_MyClass.apply(this, arguments);
				}
			}

			_inherits(SubClass, _MyClass);

			SubClass = _Inject.Inject('d', 'e', 'f')(SubClass) || SubClass;
			return SubClass;
		})(MyClass);

		_expect.expect(SubClass.$inject).to.eql(['a', 'b', 'c', 'd', 'e', 'f']);
	});
});