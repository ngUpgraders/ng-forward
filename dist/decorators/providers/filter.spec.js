'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('../../tests/frameworks');

var _testsAngular = require('../../tests/angular');

var _writers = require('../../writers');

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _filter2 = require('./filter');

describe('@Filter Decorator', function () {
	it('should set the correct name and provider type', function () {
		var SpliceFilter = (function () {
			function SpliceFilter() {
				_classCallCheck(this, _SpliceFilter);
			}

			var _SpliceFilter = SpliceFilter;
			SpliceFilter = (0, _filter2.Filter)('splice')(SpliceFilter) || SpliceFilter;
			return SpliceFilter;
		})();

		_writers.providerWriter.get('type', SpliceFilter).should.eql('filter');
		_writers.providerWriter.get('name', SpliceFilter).should.eql('splice');
	});

	it('should be parsed into a filter', function () {
		var SpliceFilter = (function () {
			function SpliceFilter() {
				_classCallCheck(this, _SpliceFilter2);
			}

			var _SpliceFilter2 = SpliceFilter;
			SpliceFilter = (0, _filter2.Filter)('splice')(SpliceFilter) || SpliceFilter;
			return SpliceFilter;
		})();

		(0, _module3['default'])('test', []).add(SpliceFilter);

		_testsAngular.ngMocks.filter.should.have.been.calledWith('splice');
	});

	describe('Filter Parser Implementation', function () {
		var _filter = undefined;

		beforeEach(function () {
			var parser = _module3['default'].getParser('filter');

			var Test = (function () {
				function Test() {
					_classCallCheck(this, Test);
				}

				_createClass(Test, [{
					key: 'supports',
					value: function supports(input) {
						return typeof input === 'string';
					}
				}, {
					key: 'transform',
					value: function transform(input, param) {
						return input + '-' + param;
					}
				}]);

				return Test;
			})();

			parser(Test, 'test', [], {
				filter: function filter(name, filterBlock) {
					_filter = filterBlock[0]();
				}
			});
		});

		it('should have created a filter', function () {
			_filter.should.be.defined;
		});

		it('should check for support before applying the transform', function () {
			var test = function test(obj) {
				return _filter(obj);
			};

			test.should['throw'](Error, /does not support/);
		});

		it('should apply the transform if the test passes', function () {
			_filter('hello', 'world').should.eql('hello-world');
		});
	});
});