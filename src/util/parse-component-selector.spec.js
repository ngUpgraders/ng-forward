import {parseComponentSelector} from './parse-component-selector';
import chai from './tests';

describe('Component selector parser', function(){
	it('should correctly parse element selectors', function(){
		let info = parseComponentSelector('my-component-selector');

		info.should.have.property('name', 'myComponentSelector');
		info.should.have.property('type', 'E');

		info = parseComponentSelector('component');

		info.name.should.equal('component');
	});

	it('should correctly parse attribute selectors', function(){
		let info = parseComponentSelector('[my-attr]');

		info.name.should.equal('myAttr');
		info.type.should.equal('A');
	});

	it('should correctly parse class selectors', function(){
		let info = parseComponentSelector('.my-class');

		info.name.should.equal('myClass');
		info.type.should.equal('C');
	});
});