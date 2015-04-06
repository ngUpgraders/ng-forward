'use strict';

var _parseComponentSelector = require('./parse-component-selector');

var _expect = require('chai');

describe('Component selector parser', function () {
	it('should correctly parse element selectors', function () {
		var info = _parseComponentSelector.parseComponentSelector('my-component-selector');

		_expect.expect(info).to.have.property('name', 'myComponentSelector');
		_expect.expect(info).to.have.property('type', 'E');

		info = _parseComponentSelector.parseComponentSelector('component');

		_expect.expect(info.name).to.equal('component');
	});

	it('should correctly parse attribute selectors', function () {
		var info = _parseComponentSelector.parseComponentSelector('[my-attr]');

		_expect.expect(info.name).to.equal('myAttr');
		_expect.expect(info.type).to.equal('A');
	});

	it('should correctly parse class selectors', function () {
		var info = _parseComponentSelector.parseComponentSelector('.my-class');

		_expect.expect(info.name).to.equal('myClass');
		_expect.expect(info.type).to.equal('C');
	});
});