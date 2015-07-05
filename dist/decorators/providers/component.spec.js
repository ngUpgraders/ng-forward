'use strict';

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
});