import { appWriter, componentWriter } from '../writers';
import { RootTestComponent } from './test-component-builder';

/**
 * A function for compiling a decorated component into a RootTestComponent
 *
 * @param ComponentClass
 * @returns {RootTestComponent}
 */
export const compileComponent = (ComponentClass) => {

  let selector = appWriter.get('selector', ComponentClass);
  let rootTestScope, debugElement, componentInstance;

  inject(($compile, $rootScope) => {
    let controllerAs = componentWriter.get('controllerAs', ComponentClass);
    componentInstance = new ComponentClass();
    rootTestScope = $rootScope.$new();
    debugElement = angular.element(`<${selector}></${selector}>`);
    debugElement = $compile(debugElement)(rootTestScope);
    rootTestScope.$digest();
  });

  return new RootTestComponent({debugElement, rootTestScope});
};


/**
 * A function for compiling an html template against a data object. This is
 * for testing directives in regular angular 1. No dependencies on the
 * ng-forward.
 *
 * Recommended to use TestComponentBuilder instead if you are using ng-forward.
 *
 * @param html
 * @param initialScope
 * @param selector
 * @returns {{parentScope: *, element: *, controller: *, isolateScope: *}}
 */
export const compileHtmlAndScope = ({html, initialScope, selector}) => {

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