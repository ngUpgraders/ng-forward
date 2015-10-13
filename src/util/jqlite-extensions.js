import {dashToCamel} from './helpers';

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
      return this.children();
    }
  }

});

export default angular.element;