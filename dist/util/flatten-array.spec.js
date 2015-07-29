/* global describe, it */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('../tests/frameworks');

var _flattenArray = require('./flatten-array');

var _flattenArray2 = _interopRequireDefault(_flattenArray);

describe('flattenArray Utility', function () {
  it('should flatten a deeply nested array', function () {
    var values = (0, _flattenArray2['default'])([1, [2, 3], [[[4]]], [5, [[[6]]]]]);

    values.should.eql([1, 2, 3, 4, 5, 6]);
  });
});