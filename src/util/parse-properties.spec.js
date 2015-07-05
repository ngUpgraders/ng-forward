import chai from '../tests/frameworks';
import parseProperties from './parse-properties';

describe('Property Parser', function(){
	it('should parse an array of colon-delimited properties', function(){
		parseProperties([
			'myProp: @anotherProp',
			'secondProp: =thirdProp'
		])

		.should.eql({
			myProp : '@anotherProp',
			secondProp : '=thirdProp'
		});
	});

	it('should parse an array of simple properties', function(){
		parseProperties([
			'@anotherProp',
			'=thirdProp'
		])

		.should.eql({
			anotherProp : '@',
			thirdProp : '='
		});
	});

	it('should throw an error if the properties are malformed', function(){
		let parse = prop => () => parseProperties([ prop ]);

		parse('myProp @anotherProp').should.throw(Error);
		parse('secondProp: thirdProp').should.throw(Error);
		parse('aProp').should.throw(Error);
	});
});