/* global it, describe */
import '../tests/frameworks';
import parseInputs from './parse-inputs';

describe('parseInputs', function(){
	it('should parse an array of colon-delimited inputs', function(){
		parseInputs([
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

	it('should parse an array of simple inputs', function(){
		parseInputs([
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
