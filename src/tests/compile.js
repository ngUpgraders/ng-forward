import {appWriter, componentWriter} from '../writers';
import { debugElementFactory } from './debug-element';
import { RootTestComponent } from './test-component-builder';

/**
 * A function for compiling a decorated component into a RootTestComponent
 *
 * @param ComponentClass
 * @returns {RootTestComponent}
 */
export const compileComponent = (ComponentClass) => {

  let selector = appWriter.get('selector', ComponentClass);
  let rootTestScope, element, componentInstance;

  inject(($compile, $rootScope) => {
    let controllerAs = componentWriter.get('controllerAs', ComponentClass);
    let template = componentWriter.get('template', ComponentClass);
    componentInstance = new ComponentClass();
    rootTestScope = $rootScope.$new();
    rootTestScope[controllerAs] = componentInstance;
    element = angular.element(`<span>${template}</span>`);
    element = $compile(element)(rootTestScope);
    rootTestScope.$digest();
  });

  let debugElement = debugElementFactory({
    nativeElement: element[0],
    componentInstance
  });

  return new RootTestComponent({debugElement, rootTestScope});
};


/**
 * A function for compiling an html template against a data object. This is
 * tested directives in regular angular 1. Recommended to use TestComponentBuilder
 * instead.
 *
 * @param component
 * @param html
 * @param initialScope
 * @returns {{parentScope: *, element: *, controller: *, isolateScope: *}}
 */
export const compileHtmlAndScope = ({component, html, initialScope}) => {

  let selector = appWriter.get('selector', component);
  let parentScope, element, controller, isolateScope;

  inject(($compile, $rootScope) => {
    parentScope = $rootScope.$new();
    Object.assign(parentScope, initialScope);
    element = angular.element(html);
    element = $compile(element)(parentScope);
    parentScope.$digest();
    isolateScope = element.isolateScope();
    controller = element.controller(`${selector}`);
  });

  return {parentScope, element, controller, isolateScope};
};