import bundle from '../bundle';
import { Providers } from '../decorators/providers';
import { providers, allProviders, clearProviders } from './providers';
import { bundleStore, componentStore } from '../writers';
import { View } from '../decorators/component'
import {INgForwardJQuery} from "../util/jqlite-extensions";

/**
 * TestComponentBuilder
 *
 * The preferred way to test components
 */
export class TestComponentBuilder {
  /**
   * Takes a root component, typically a test component whose template houses another component
   * under test. Returns a RootTestComponent that contains a debugElement reference
   * to the test component (which you can use to drill down to the component under test) as well
   * as a detectChanges method which aliases to a scope digest call.
   *
   * @param rootComponent
   * @returns {RootTestComponent}
   */
  create(rootComponent) {
    let decoratedModule = bundle('test.module', rootComponent);
    angular.mock.module(decoratedModule.name);
    angular.mock.module($provide =>
        allProviders().forEach(({token, useValue}) =>
            $provide.value(token, useValue)));

    let rootTC = compileComponent(rootComponent);
    clearProviders();
    return rootTC;
  }

  overrideTemplate(component, template) {
    componentStore.set('template', template, component);
    return this;
  }

  overrideProviders(component, providers) {
    bundleStore.set('providers', providers, component);
    return this;
  }

  overrideView(component, config) {
    View(config)(component);
    return this;
  }

  overrideDirective()     { throw new Error('Method not supported in ng-forward.'); }
  overrideViewBindings()  { throw new Error('Method not supported in ng-forward.'); }
}


/**
 * RootTestComponent is what is returned from a TestComponentBuilder.create call.
 * It gives access to the root test debug element, which in turn gives access to
 * component instance, children and angular element methods. Also has a detectChanges
 * method that triggers a digest.
 */
export class RootTestComponent {
  public debugElement : INgForwardJQuery;
  private _rootTestScope : ng.IScope;

  constructor({debugElement, rootTestScope, $injector}) {
    this.debugElement = debugElement;
    this.debugElement.data('$injector', $injector);
    this._rootTestScope = rootTestScope;
  }

  /**
   * Triggers a root test scope digest.
   */
  detectChanges(): void {
    this._rootTestScope.$digest();
  }
}


/**
 * A function for compiling a decorated component into a RootTestComponent
 *
 * @param ComponentClass
 * @returns {RootTestComponent}
 */
export const compileComponent = (ComponentClass:any) => {

  let selector = bundleStore.get('selector', ComponentClass);
  let rootTestScope, debugElement, componentInstance, $injector;

  inject(($compile, $rootScope, _$injector_) => {
    let controllerAs = componentStore.get('controllerAs', ComponentClass);
    componentInstance = new ComponentClass();
    rootTestScope = $rootScope.$new();
    debugElement = angular.element(`<${selector}></${selector}>`);
    debugElement = $compile(debugElement)(rootTestScope);
    rootTestScope.$digest();
    $injector = _$injector_;
  });

  return new RootTestComponent({debugElement, rootTestScope, $injector});
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