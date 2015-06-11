'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parseComponentSelector = require('./parse-component-selector');

var _tests = require('./tests');

var _tests2 = _interopRequireDefault(_tests);

describe('Component selector parser', function () {
	it('should correctly parse element selectors', function () {
		var info = (0, _parseComponentSelector.parseComponentSelector)('my-component-selector');

		info.should.have.property('name', 'myComponentSelector');
		info.should.have.property('type', 'E');

		info = (0, _parseComponentSelector.parseComponentSelector)('component');

		info.name.should.equal('component');
	});

	it('should correctly parse attribute selectors', function () {
		var info = (0, _parseComponentSelector.parseComponentSelector)('[my-attr]');

		info.name.should.equal('myAttr');
		info.type.should.equal('A');
	});

	it('should correctly parse class selectors', function () {
		var info = (0, _parseComponentSelector.parseComponentSelector)('.my-class');

		info.name.should.equal('myClass');
		info.type.should.equal('C');
	});
});