import '../tests/frameworks';
import {flatten} from './helpers';

describe('flatten array helper', function(){
  it('should flatten a deeply nested array', function(){
    let values = flatten([1, [2, 3], [[[4]]], [5, [[[6]]]]]);

    values.should.eql([1, 2, 3, 4, 5, 6]);
  });
});
