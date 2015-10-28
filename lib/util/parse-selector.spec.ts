import '../tests/frameworks';
import parseSelector from './parse-selector';

describe('Component selector parser', function(){
	it('should correctly parse element selectors', function(){
		let info = parseSelector('my-component-selector');

		info.should.have.property('name', 'myComponentSelector');
		info.should.have.property('type', 'E');

		info = parseSelector('component');

		info.name.should.equal('component');
	});

	it('should correctly parse attribute selectors', function(){
		let info = parseSelector('[my-attr]');

		info.name.should.equal('myAttr');
		info.type.should.equal('A');
	});

	it('should correctly parse class selectors', function(){
		let info = parseSelector('.my-class');

		info.name.should.equal('myClass');
		info.type.should.equal('C');
	});
});