import {parseComponentSelector} from './parse-component-selector';
import {expect} from 'chai';

describe('Component selector parser', function(){
	it('should correctly parse element selectors', function(){
		let info = parseComponentSelector('my-component-selector');

		expect(info).to.have.property('name', 'myComponentSelector');
		expect(info).to.have.property('type', 'E');

		info = parseComponentSelector('component');

		expect(info.name).to.equal('component');
	});

	it('should correctly parse attribute selectors', function(){
		let info = parseComponentSelector('[my-attr]');

		expect(info.name).to.equal('myAttr');
		expect(info.type).to.equal('A');
	});

	it('should correctly parse class selectors', function(){
		let info = parseComponentSelector('.my-class');

		expect(info.name).to.equal('myClass');
		expect(info.type).to.equal('C');
	});
});