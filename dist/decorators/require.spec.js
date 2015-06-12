'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilTests = require('../util/tests');

var _utilTests2 = _interopRequireDefault(_utilTests);

// import {Require} from './require';

xdescribe('@Require annotation for requiring directive controllers', function () {
	it('should add $component meta data', function () {
		var MyComponent = (function () {
			function MyComponent() {
				_classCallCheck(this, _MyComponent);
			}

			var _MyComponent = MyComponent;
			MyComponent = Require('^parentCtrl', 'siblingCtrl')(MyComponent) || MyComponent;
			return MyComponent;
		})();

		getMeta('$component:require', MyComponent).should.eql(['^parentCtrl', 'siblingCtrl']);
	});

	it('should adhere to inheritance', function () {
		var Test = (function () {
			function Test() {
				_classCallCheck(this, _Test);
			}

			var _Test = Test;
			Test = Require('^parent')(Test) || Test;
			return Test;
		})();

		var NewTest = (function (_Test2) {
			function NewTest() {
				_classCallCheck(this, _NewTest);

				if (_Test2 != null) {
					_Test2.apply(this, arguments);
				}
			}

			_inherits(NewTest, _Test2);

			var _NewTest = NewTest;
			NewTest = Require('sibling')(NewTest) || NewTest;
			return NewTest;
		})(Test);

		getMeta('$component:require', Test).should.eql(['^parent']);
		getMeta('$component:require', NewTest).should.eql(['^parent', 'sibling']);
	});
});