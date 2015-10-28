import {ng} from './angular';
import '../util/jqlite-extensions';
import {TestComponentBuilder} from '../testing/test-component-builder';
import {Component} from '../decorators/component';

export const quickRootTestComponent = ({
      providers=[],
      directives=[],
      template='<div></div>'
    }) => {

  ng.useReal();

  @Component({ selector: 'test', template, directives, providers })
  class Test {}

  return new TestComponentBuilder().create(Test);
};