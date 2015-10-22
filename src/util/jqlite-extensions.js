import {dashToCamel} from './helpers';
import {getInjectableName} from './get-injectable-name';

Object.defineProperties(angular.element.prototype, {

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
      return (this.injector() || this.inheritedData('$injector'))
          .get(getInjectableName(injectable));
    }
  }

});

export default angular.element;