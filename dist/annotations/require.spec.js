'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _expect = require('chai');

var _Require = require('./require');

describe('@Require annotation for requiring directive controllers', function () {
	it('should add $component meta data', function () {
		var MyComponent = (function () {
			function MyComponent() {
				_classCallCheck(this, MyComponent);
			}

			MyComponent = _Require.Require('^parentCtrl', 'siblingCtrl')(MyComponent) || MyComponent;
			return MyComponent;
		})();

		_expect.expect(MyComponent.$component.require).to.eql(['^parentCtrl', 'siblingCtrl']);
	});

	it('should add a convience static method for unpacking requires', function () {
		var MyComponent = (function () {
			function MyComponent() {
				_classCallCheck(this, MyComponent);
			}

			_createClass(MyComponent, null, [{
				key: 'link',
				value: function link(scope, element, attrs, ctrls) {
					var _MyComponent$unpackRequires = MyComponent.unpackRequires(ctrls);

					var parentCtrl = _MyComponent$unpackRequires.parentCtrl;
					var siblingCtrl = _MyComponent$unpackRequires.siblingCtrl;

					_expect.expect(parentCtrl).to.eql('Parent Controller');
					_expect.expect(siblingCtrl).to.eql('Sibling Controller');
				}
			}]);

			MyComponent = _Require.Require('^parentCtrl', 'siblingCtrl')(MyComponent) || MyComponent;
			return MyComponent;
		})();

		MyComponent.link(0, 0, 0, ['Parent Controller', 'Sibling Controller']);
	});
});