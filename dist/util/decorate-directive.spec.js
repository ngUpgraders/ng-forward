/*global describe,it,beforeEach */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _decorateDirective = require('./decorate-directive');

var _decorateDirective2 = _interopRequireDefault(_decorateDirective);

var _module2 = require('../module');

var _module3 = _interopRequireDefault(_module2);

var _writers = require('../writers');

var _testsFrameworks = require('../tests/frameworks');

describe('Directive Decorator', function () {
	var Example = function Example() {
		_classCallCheck(this, Example);
	};

	it('should let you bind attributes to the controller using a simple map', function () {
		(0, _decorateDirective2['default'])({ bind: {
				'someProp': '@'
			} }, Example);

		_writers.componentWriter.get('scope', Example).should.eql({ someProp: '@' });
		_writers.componentWriter.get('bindToController', Example).should.be.ok;
	});

	it('should manually let you configure the scope', function () {
		(0, _decorateDirective2['default'])({
			scope: true
		}, Example);

		_writers.componentWriter.get('scope', Example).should.be.ok;
	});

	it('should let you bind attributes to the controller using a properties array like Angular 2', function () {
		(0, _decorateDirective2['default'])({
			properties: ['someProp: @', 'anotherProp: =']
		}, Example);

		_writers.componentWriter.get('bindToController', Example).should.eql({
			'someProp': '@',
			'anotherProp': '='
		});
	});

	it('should throw an error if you do not pass an array to the properties field', function () {
		var dec = function dec(val) {
			return function () {
				return (0, _decorateDirective2['default'])({
					properties: val
				}, Example);
			};
		};

		dec('string').should['throw'](TypeError);
		dec({}).should['throw'](TypeError);
		dec(false).should['throw'](TypeError);
		dec(null).should['throw'](TypeError);
		dec(undefined).should.not['throw'](TypeError);
	});

	it('should set the controllerAs field if provided', function () {
		(0, _decorateDirective2['default'])({ controllerAs: 'hi' }, Example);

		_writers.componentWriter.get('controllerAs', Example).should.eql('hi');
	});

	afterEach(function () {
		_writers.componentWriter.clear(Example);
	});

	describe('Directive Parser', function () {
		var parser = undefined,
		    ngModule = undefined;

		beforeEach(function () {
			parser = _module3['default'].getParser('directive');
			ngModule = { directive: _testsFrameworks.sinon.spy() };
		});

		it('should be defined', function () {
			parser.should.be.defined;
		});

		it('should correctly generate a simple DDO', function () {
			var Test = function Test() {
				_classCallCheck(this, Test);
			};

			(0, _decorateDirective2['default'])({}, Test);

			parser(Test, 'testSelector', [], ngModule);

			var _ngModule$directive$args$0 = _slicedToArray(ngModule.directive.args[0], 2);

			var name = _ngModule$directive$args$0[0];
			var factory = _ngModule$directive$args$0[1];

			name.should.eql('testSelector');
			(typeof factory).should.eql('function');
			factory().should.eql({
				controller: [Test]
			});
		});

		it('should generate a complex DDO', function () {
			var AnotherTest = (function () {
				function AnotherTest() {
					_classCallCheck(this, AnotherTest);
				}

				_createClass(AnotherTest, null, [{
					key: 'link',
					value: function link() {}
				}, {
					key: 'compile',
					value: function compile() {}
				}]);

				return AnotherTest;
			})();

			(0, _decorateDirective2['default'])({
				scope: true,
				properties: ['attr: @', 'prop : ='],
				controllerAs: 'asdf'
			}, AnotherTest);

			parser(AnotherTest, 'testSelector', ['$q', '$timeout'], ngModule);

			var _ngModule$directive$args$02 = _slicedToArray(ngModule.directive.args[0], 2);

			var name = _ngModule$directive$args$02[0];
			var factory = _ngModule$directive$args$02[1];

			factory().should.eql({
				scope: true,
				bindToController: {
					attr: '@',
					prop: '='
				},
				controllerAs: 'asdf',
				controller: ['$q', '$timeout', AnotherTest],
				link: AnotherTest.link,
				compile: AnotherTest.compile
			});
		});

		it('should respect properties inheritance during parsing', function () {
			var Parent = function Parent() {
				_classCallCheck(this, Parent);
			};

			(0, _decorateDirective2['default'])({
				properties: ['=first', '@second'],
				scope: {
					first: '=',
					second: '&another'
				}
			}, Parent);

			var Child = (function (_Parent) {
				_inherits(Child, _Parent);

				function Child() {
					_classCallCheck(this, Child);

					_get(Object.getPrototypeOf(Child.prototype), 'constructor', this).apply(this, arguments);
				}

				return Child;
			})(Parent);

			(0, _decorateDirective2['default'])({
				properties: ['&second', '&third', 'fourth: =*renamed'],
				scope: {
					second: '=primary',
					third: '@'
				}
			}, Child);

			parser(Child, 'childSelector', [], ngModule);

			var _ngModule$directive$args$03 = _slicedToArray(ngModule.directive.args[0], 2);

			var name = _ngModule$directive$args$03[0];
			var factory = _ngModule$directive$args$03[1];

			factory().should.eql({
				bindToController: {
					first: '=',
					second: '&',
					third: '&',
					fourth: '=*renamed'
				},
				scope: {
					first: '=',
					second: '=primary',
					third: '@'
				},
				controller: [Child]
			});
		});
	});
});