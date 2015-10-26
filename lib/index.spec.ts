import {expect} from './tests/frameworks';
import * as Exports from './index';

describe('ng-forward', () => {
  for(let key in Exports){
    it(`should export ${key}`, () => {
      expect(Exports[key]).to.be.defined;
    });
  }
});