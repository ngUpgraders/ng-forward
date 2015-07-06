import chai from '../tests/frameworks';
import parseProperties from './parse-properties';

describe('Property Parser', function(){
	it('should parse an array of colon-delimited properties', function(){
		parseProperties([
			'a: @a1',
			'b: =b2',
			'c: =?c2',
			'd: =*d2',
			'e: =*?e2'
		])

		.should.eql({
			a : '@a1',
			b : '=b2',
			c : '=?c2',
			d : '=*d2',
			e : '=*?e2'
		});
	});

	it('should parse an array of simple properties', function(){
		parseProperties([
			'@a',
			'=b',
			'=?c',
			'=*?d'
		])

		.should.eql({
			a: '@',
			b: '=',
			c: '=?',
			d: '=*?'
		});
	});

	it('should throw an error if the properties are malformed', function(){
		let parse = prop => () => parseProperties([ prop ]);

		parse('myProp @anotherProp').should.throw(Error);
		parse('secondProp: thirdProp').should.throw(Error);
		parse('aProp').should.throw(Error);
	});
});