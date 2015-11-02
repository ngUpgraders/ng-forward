import {ng} from './angular';
import '../util/jqlite-extensions';
import * as tcb from '../testing/test-component-builder';
import {Component} from '../decorators/component';

export function quickRootTestComponent({
      providers=[],
      directives=[],
      template='<div></div>'
    }){

  ng.useReal();

  @Component({ selector: 'test', template, directives, providers })
  class Test {}

  let builder =  new tcb.TestComponentBuilder();
  
  return builder.create(Test);
};