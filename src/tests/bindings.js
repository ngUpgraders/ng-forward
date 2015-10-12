import { providerWriter } from '../writers';

/**
 * Stores references to all bindings. Is cleared by TestComponentBuilder after a create call.
 * @type {Array}
 * @private
 */
let _bindings = [];

/**
 * A sugar function for use in a beforeEach block. It's passed the bind method for
 * creating bindings. Can use in one of two ways:
 *
 * beforeEach(bindings(bind => {}));
 * or
 * beforeEach(() => {
 *   bindings(bind => {});
 * })
 * @param bindFn(bind): <Bindings>
 * @returns {workFn}
 */
export const bindings = (bindFn) => {
  return isSpecRunning() ? workFn() : workFn;
  function workFn() {
    _bindings.push(...bindFn(bind));
  }
};

/**
 * A binding from a token to a value (only one implemented currently), class, alias, or factory
 */
export class Binding {
  constructor(token) {
    this.token = providerWriter.get('name', token);
  }
  toValue(value) {
    this.value = value;
    return this;
  }
  toClass() { throw new Error('not implemented'); }
  toAlias() { throw new Error('not implemented'); }
  toFactory() { throw new Error('not implemented'); }
}

Object.defineProperties(Binding, {
  bindings: {
    get() { return angular.copy(_bindings); }
  },
  clear: {
    value: () => _bindings = []
  }
});


/**
 * Sugar for creating a new binding.
 * @param token
 */
export const bind = token => {
  return new Binding(token);
};


// helpers for mocha and jasmine beforeEach
var currentSpec = null;
function isSpecRunning() {
  return !!currentSpec;
}
if (window.jasmine || window.mocha) {
  (window.beforeEach || window.setup)(function () {
    currentSpec = this;
  });
  (window.afterEach || window.teardown)(function () {
    currentSpec = null;
  });
}