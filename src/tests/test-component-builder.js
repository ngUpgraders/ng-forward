import bundle from '../bundle';
import { compileComponent } from './compile';
import { Binding } from '../util/binding';

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
    let decoratedModule = bundle('test-ng-forward', rootComponent);
    angular.mock.module(decoratedModule.name);
    angular.mock.module($provide =>
        Binding.bindings.forEach(({token, value}) =>
            $provide.value(token, value)));

    let rootTC = compileComponent(rootComponent);
    Binding.clear();
    return rootTC;
  }

  overrideTemplate()      { throw new Error('not implemented'); }
  overrideView()          { throw new Error('not implemented'); }
  overrideDirective()     { throw new Error('not implemented'); }
  overrideBindings()      { throw new Error('not implemented'); }
  overrideViewBindings()  { throw new Error('not implemented'); }
}

/**
 * RootTestComponent is what is returned from a TestComponentBuilder.create call.
 * It gives access to the root test debug element, which in turn gives access to
 * component instance, children and angular element methods. Also has a detectChanges
 * method that triggers a digest.
 */
export class RootTestComponent {
  constructor({debugElement, rootTestScope}) {
    this.debugElement = debugElement;
    this._rootTestScope = rootTestScope;
  }

  /**
   * Triggers a root test scope digest.
   */
  detectChanges() {
    this._rootTestScope.$digest();
  }
}