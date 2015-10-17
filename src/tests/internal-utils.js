import {ng} from './angular';
import {TestComponentBuilder} from './test-component-builder';
import {Component} from '../decorators/providers/component';

export const buildRootTestWithProvider = p => {
  ng.useReal();

  @Component({ selector: 'testComponent', template: '<div' })
  class Test {}

  return new TestComponentBuilder()
      .overrideProviders(Test, [p])
      .create(Test);
};