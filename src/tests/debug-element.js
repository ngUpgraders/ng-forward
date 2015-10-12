/**
 * Takes a native dom element and component class instance. Returns an angular
 * element that is decorated with Angular 2 debugElement methods to help with
 * getting component instance, native element, and view children.
 *
 * @param nativeElement
 * @param componentInstance
 * @returns {*}
 */
export function debugElementFactory({nativeElement, componentInstance}) {

  let debugElement = angular.element(nativeElement);

  Object.defineProperties(debugElement, {

    _componentViewChildren: { value: null, writable: true },

    /**
     * @returns {Component Instance}
     */
    componentInstance: {
      get() { return componentInstance; }
    },

    /**
     * @returns {Native DOM Element}
     */
    nativeElement: {
      get() { return nativeElement; }
    },

    /**
     * @returns {Array<DebugElement>}
     */
    componentViewChildren: {
      get() {
        if (this._componentViewChildren) {
          return this._componentViewChildren;
        }

        let children = [...this.children()]
            .map(el => debugElementFactory({
              nativeElement: el,
              componentInstance: getComponentInstanceFromElement(el)
            }));

        return this._componentViewChildren = children;
      }
    }
  });

  return debugElement;
}

function getComponentInstanceFromElement(el) {
  let isolateScope = angular.element(el).isolateScope();
  let name = dashToCamel(el.tagName.toLowerCase());
  return isolateScope[name];
}

export function ucFirst(word) {
  return word.charAt(0).toUpperCase() + word.substr(1)
}

export function dashToCamel(dash) {
  var words = dash.split('-');
  return words.shift() + words.map(ucFirst).join('')
}