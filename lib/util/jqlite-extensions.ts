import {dashToCamel} from './helpers';
import {getInjectableName} from './get-injectable-name';
import JQuery from "./";
import IAugmentedJQuery = angular.IAugmentedJQuery;
import IAugmentedJQueryStatic = angular.IAugmentedJQueryStatic;

export interface INgForwardJQueryStatic extends IAugmentedJQueryStatic {
  (selector: string, context?: any): INgForwardJQuery;
  (element: Element): INgForwardJQuery;
  (object: {}): INgForwardJQuery;
  (elementArray: Element[]): INgForwardJQuery;
  (object: JQuery): INgForwardJQuery;
  (func: Function): INgForwardJQuery;
  (array: any[]): INgForwardJQuery;
  (): INgForwardJQuery;
}

export interface INgForwardJQuery extends IAugmentedJQuery {
  find(selector: string): INgForwardJQuery;
  find(element: any): INgForwardJQuery;
  find(obj: JQuery): INgForwardJQuery;

  nativeElement: IAugmentedJQuery.HTMLElement;
  componentInstance: any;
  componentViewChildren: INgForwardJQuery[];
  getLocal(injectable:any): any;
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
        let name = dashToCamel(this[0].tagName.toLowerCase());
        this._componentInstance = isolateScope && isolateScope[name] || null;
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
      value: function(predicate, scope) {
        throw new Error('Not yet implemented in ng-forward.')
      }
    },

    queryAll: {
      value: function(predicate, scope) {
        throw new Error('Not yet implemented in ng-forward.')
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