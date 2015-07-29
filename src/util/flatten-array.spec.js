/* global describe, it */
import '../tests/frameworks';
import flattenArray from './flatten-array';

describe('flattenArray Utility', function(){
  it('should flatten a deeply nested array', function(){
    let values = flattenArray([1, [2, 3], [[[4]]], [5, [[[6]]]]]);

    values.should.eql([1, 2, 3, 4, 5, 6]);
  });
});
