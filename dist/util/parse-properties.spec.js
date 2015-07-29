/* global it, describe */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('../tests/frameworks');

var _parseProperties = require('./parse-properties');

var _parseProperties2 = _interopRequireDefault(_parseProperties);

describe('Property Parser', function () {
	it('should parse an array of colon-delimited properties', function () {
		(0, _parseProperties2['default'])(['a: a1', 'b: b2', 'c: c2', 'd: d2', 'e: e2']).should.eql({
			a: 'a1',
			b: 'b2',
			c: 'c2',
			d: 'd2',
			e: 'e2'
		});
	});

	it('should parse an array of simple properties', function () {
		(0, _parseProperties2['default'])(['a', 'b', 'c', 'd']).should.eql({
			a: 'a',
			b: 'b',
			c: 'c',
			d: 'd'
		});
	});
});