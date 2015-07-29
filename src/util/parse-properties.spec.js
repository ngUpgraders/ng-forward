/* global it, describe */
import '../tests/frameworks';
import parseProperties from './parse-properties';

describe('Property Parser', function(){
	it('should parse an array of colon-delimited properties', function(){
		parseProperties([
			'a: a1',
			'b: b2',
			'c: c2',
			'd: d2',
			'e: e2'
		])

		.should.eql({
			a: 'a1',
			b: 'b2',
			c: 'c2',
			d: 'd2',
			e: 'e2'
		});
	});

	it('should parse an array of simple properties', function(){
		parseProperties([
			'a',
			'b',
			'c',
			'd'
		])

		.should.eql({
			a: 'a',
			b: 'b',
			c: 'c',
			d: 'd'
		});
	});
});
