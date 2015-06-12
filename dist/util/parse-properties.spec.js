'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tests = require('./tests');

var _tests2 = _interopRequireDefault(_tests);

var _parseProperties = require('./parse-properties');

var _parseProperties2 = _interopRequireDefault(_parseProperties);

describe('Property Parser', function () {
	it('should parse an array of colon-delimited properties', function () {
		(0, _parseProperties2['default'])(['myProp: @anotherProp', 'secondProp: =thirdProp']).should.eql({
			myProp: '@anotherProp',
			secondProp: '=thirdProp'
		});
	});

	it('should parse an array of simple properties', function () {
		(0, _parseProperties2['default'])(['@anotherProp', '=thirdProp']).should.eql({
			anotherProp: '@',
			thirdProp: '='
		});
	});

	it('should throw an error if the properties are malformed', function () {
		var parse = function parse(prop) {
			return function () {
				return (0, _parseProperties2['default'])([prop]);
			};
		};

		parse('myProp @anotherProp').should['throw'](Error);
		parse('secondProp: thirdProp').should['throw'](Error);
		parse('aProp').should['throw'](Error);
	});
});