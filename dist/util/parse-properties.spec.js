'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _testsFrameworks = require('../tests/frameworks');

var _testsFrameworks2 = _interopRequireDefault(_testsFrameworks);

var _parseProperties = require('./parse-properties');

var _parseProperties2 = _interopRequireDefault(_parseProperties);

describe('Property Parser', function () {
	it('should parse an array of colon-delimited properties', function () {
		(0, _parseProperties2['default'])(['a: @a1', 'b: =b2', 'c: =?c2', 'd: =*d2', 'e: =*?e2']).should.eql({
			a: '@a1',
			b: '=b2',
			c: '=?c2',
			d: '=*d2',
			e: '=*?e2'
		});
	});

	it('should parse an array of simple properties', function () {
		(0, _parseProperties2['default'])(['@a', '=b', '=?c', '=*?d']).should.eql({
			a: '@',
			b: '=',
			c: '=?',
			d: '=*?'
		});
	});

	it('should throw an error if the properties are malformed', function () {
		var parse = function parse(prop) {
			return function () {
				return (0, _parseProperties2['default'])([prop]);
			};
		};

		parse('myProp @anotherProp').should['throw'](Error);
		parse('secondProp: thirdProp').should['throw'](Error);
		parse('aProp').should['throw'](Error);
	});
});