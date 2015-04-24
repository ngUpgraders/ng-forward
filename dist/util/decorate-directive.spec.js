'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _decorateDirective = require('./decorate-directive');

var _Module = require('../module/module');

var _sinon = require('./tests');

var Decorate = function Decorate(name, type, binder) {
	return function (t) {
		_decorateDirective.decorateDirective(t, name, type, binder);
	};
};

describe('Directive decorator', function () {
	it('should decorate a target with the given name and type', function () {
		var Example = function Example() {
			_classCallCheck(this, Example);
		};

		_decorateDirective.decorateDirective(Example, 'test', 'E');

		Example.should.have.property('$component');
		Example.should.have.property('$provider');
		Example.$provider.name.should.equal('test');
		Example.$provider.type.should.equal('directive');
		Example.$component.restrict.should.equal('E');
	});

	it('should attach a scope binding expression if a binder is provided', function () {
		var Example = function Example() {
			_classCallCheck(this, Example);
		};

		_decorateDirective.decorateDirective(Example, 'test', 'E', { myAttr: '=' });

		Example.$component.should.have.property('scope');
		Example.$component.scope.should.have.property('myAttr', '=');
	});

	it('should set bindToController:true; if a binder is provided', function () {
		var Example = function Example() {
			_classCallCheck(this, Example);
		};

		_decorateDirective.decorateDirective(Example, 'test', 'E', { myAttr: '=' });

		Example.$component.should.have.property('bindToController', true);
	});

	it('should merge binders if used on a subclass', function () {
		var Example = function Example() {
			_classCallCheck(this, Example);
		};

		_decorateDirective.decorateDirective(Example, 'test', 'E', { myAttr: '=' });

		var NewExample = (function (_Example) {
			function NewExample() {
				_classCallCheck(this, NewExample);

				if (_Example != null) {
					_Example.apply(this, arguments);
				}
			}

			_inherits(NewExample, _Example);

			return NewExample;
		})(Example);

		_decorateDirective.decorateDirective(NewExample, 'test', 'A', { newAttr: '&' });

		Example.$component.scope.should.eql({
			myAttr: '='
		});

		NewExample.$component.scope.should.eql({
			myAttr: '=',
			newAttr: '&'
		});
	});

	it('should respect inheritance', function () {
		var BaseComponent = (function () {
			function BaseComponent() {
				_classCallCheck(this, _BaseComponent);
			}

			var _BaseComponent = BaseComponent;
			BaseComponent = Decorate('baseComponent', 'E')(BaseComponent) || BaseComponent;
			return BaseComponent;
		})();

		var NewComponent = (function (_BaseComponent2) {
			function NewComponent() {
				_classCallCheck(this, _NewComponent);

				if (_BaseComponent2 != null) {
					_BaseComponent2.apply(this, arguments);
				}
			}

			_inherits(NewComponent, _BaseComponent2);

			var _NewComponent = NewComponent;
			NewComponent = Decorate('newComponent', 'E')(NewComponent) || NewComponent;
			return NewComponent;
		})(BaseComponent);

		BaseComponent.$provider.name.should.equal('baseComponent');
	});

	describe('parser', function () {
		it('should be registered with Module', function () {
			var parser = _Module.Module.getParser('directive');

			parser.should.be.defined;
		});

		it('should register a directive on a module', function () {
			var parser = _Module.Module.getParser('directive');
			var module = {
				directive: _sinon.sinon.spy()
			};

			var MyComponent = (function () {
				function MyComponent() {
					_classCallCheck(this, MyComponent);
				}

				_createClass(MyComponent, null, [{
					key: 'link',
					value: function link() {}
				}, {
					key: 'compile',
					value: function compile() {}
				}]);

				return MyComponent;
			})();

			_decorateDirective.decorateDirective(MyComponent, 'myComponent', 'E', { myAttr: '=' });

			parser(MyComponent, module);

			var name = module.directive.args[0][0];
			var provider = module.directive.args[0][1];
			var directive = provider();
			var controller = directive.controller;
			delete controller.$component;

			name.should.equal('myComponent');
			directive.should.eql({
				restrict: 'E',
				bindToController: true,
				scope: { myAttr: '=' },
				link: MyComponent.link,
				controller: controller,
				compile: MyComponent.compile,
				controllerAs: 'MyComponent'
			});
		});

		it('should allow for a static link function on the class', function () {
			var parser = _Module.Module.getParser('directive');
			var module = {
				directive: _sinon.sinon.spy()
			};
			var testLink = false;

			var MyComponent = (function () {
				function MyComponent() {
					_classCallCheck(this, MyComponent);
				}

				_createClass(MyComponent, null, [{
					key: 'link',
					value: function link() {
						testLink = true;
					}
				}]);

				return MyComponent;
			})();

			_decorateDirective.decorateDirective(MyComponent, 'myComponent', 'E', {});
			parser(MyComponent, module);

			var directive = module.directive.args[0][1]();

			directive.link();

			testLink.should.be.ok;
		});
	});
});