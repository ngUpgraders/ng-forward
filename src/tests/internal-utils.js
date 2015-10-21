import {ng} from './angular';
import {TestComponentBuilder} from './test-component-builder';
import {Component} from '../decorators/providers/component';
import {View} from '../decorators/component/view';

export const quickBuildRootTest = ({
      providers=[],
      directives=[],
      template='<div></div>'
    }) => {

  ng.useReal();

  @Component({ selector: 'test-component', template, directives, providers })
  class Test {}

  return new TestComponentBuilder().create(Test);
};