import {bundleStore} from '../writers'
import {dashToCamel} from './helpers';
import {getInjectableName} from './get-injectable-name';
import IAugmentedJQuery = angular.IAugmentedJQuery;
import IAugmentedJQueryStatic = angular.IAugmentedJQueryStatic;
import {ngClass} from "../testing/test-component-builder";

export interface INgForwardJQueryStatic extends IAugmentedJQueryStatic {
  (selector: string, context?: any): INgForwardJQuery;
  (element: any): INgForwardJQuery;
  (object: {}): INgForwardJQuery;
  (elementArray: any[]): INgForwardJQuery;
  (object: IAugmentedJQuery): INgForwardJQuery;
  (func: Function): INgForwardJQuery;
  (array: any[]): INgForwardJQuery;
  (): INgForwardJQuery;
}

export interface INgForwardJQuery extends IAugmentedJQuery {
  find(selector: string): INgForwardJQuery;
  find(element: any): INgForwardJQuery;
  find(obj: IAugmentedJQuery): INgForwardJQuery;

  nativeElement: any;
  componentInstance: any;
  componentViewChildren: INgForwardJQuery[];
  getLocal(injectable:any): any;
  queryAll(predicate:string, scope?:any): INgForwardJQuery[];
  query(predicate:string, scope?:any): INgForwardJQuery;
}

export class By {
  static all():string {
    return '*'
  }

  static css(selector: string):string {
    return selector;
  }

  static directive(type: ngClass):string {
    return bundleStore.get('selector', type);
  }
}

(function extendJQLite(proto:IAugmentedJQuery) {
  Object.defineProperties(proto, {

    nativeElement: {
      get() {
        return this[0];
      }
    },

    componentInstance: {
      get() {
        if (this._componentInstance) return this._componentInstance;
        let isolateScope = this.isolateScope();
        this._componentInstance = isolateScope && isolateScope['ctrl'] || null;
        return this._componentInstance;
      }
    },

    componentViewChildren: {
      get() {
        return [...this.children()].map(child => angular.element(child));
      }
    },

    getLocal: {
      value: function(injectable) {
        //noinspection TypeScriptUnresolvedFunction
        return (this.injector() || this.inheritedData('$injector'))
            .get(getInjectableName(injectable));
      }
    },

    query: {
      value: function(predicate, scope?) {
        //noinspection TypeScriptUnresolvedFunction
        let results = this.queryAll(predicate, scope);
        return results.length > 0 ? results[0] : null;
      }
    },

    queryAll: {
      value: function(predicate, scope?) {
        if (scope) throw Error('scope argument not yet supported. All queries are done with Scope.all for now.');
        return Array
            .from(this[0].querySelectorAll(predicate))
            .map(el => angular.element(el));
      }
    },

    getDirectiveInstance: {
      value: function(index) {
        throw new Error('Not yet implemented in ng-forward.')
      }
    },

    triggerEventHandler: {
      value: function(eventName, eventObj) {
        throw new Error('Not yet implemented in ng-forward.')
      }
    },

    inject: {
      value: function(type) {
        throw new Error('Not yet implemented in ng-forward.');
      }
    },

    hasDirective: {
      value: function(type) {
        throw new Error('Not yet implemented in ng-forward.');
      }
    }

  });

})(angular.element.prototype);

export default angular.element;
