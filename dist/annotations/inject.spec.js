'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Inject = require('./inject');

var _chai = require('../util/tests');

var _chai2 = _interopRequireWildcard(_chai);

describe('@Inject annotation', function () {
	it('should decorate a function with the $inject array', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = _Inject.Inject('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.should.have.property('$inject');
	});

	it('should add injected dependencies to the $inject array', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass2);
			}

			var _MyClass2 = MyClass;
			MyClass = _Inject.Inject('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		MyClass.$inject.should.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass3);
			}

			var _MyClass3 = MyClass;
			MyClass = _Inject.Inject('a', 'b', 'c')(MyClass) || MyClass;
			return MyClass;
		})();

		var SubClass = (function (_MyClass4) {
			function SubClass() {
				_classCallCheck(this, _SubClass);

				if (_MyClass4 != null) {
					_MyClass4.apply(this, arguments);
				}
			}

			_inherits(SubClass, _MyClass4);

			var _SubClass = SubClass;
			SubClass = _Inject.Inject('d', 'e', 'f')(SubClass) || SubClass;
			return SubClass;
		})(MyClass);

		MyClass.$inject.should.eql(['a', 'b', 'c']);
		SubClass.$inject.should.eql(['a', 'b', 'c', 'd', 'e', 'f']);
	});
});