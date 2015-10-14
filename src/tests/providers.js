import { provide } from '../util/provider';

/**
 * Stores references to all bindings. Is cleared by TestComponentBuilder after a create call.
 * @type {Array}
 * @private
 */
let _providers = [];

/**
 * A sugar function for use in a beforeEach block. It's passed the bind method for
 * creating bindings. Can use in one of two ways:
 *
 * beforeEach(bindings(bind => {}));
 * or
 * beforeEach(() => {
 *   bindings(bind => {});
 * })
 * @param provideFn(provide):[Provider]
 * @returns {workFn}
 */
export const providers = (provideFn) => {
  return isSpecRunning() ? workFn() : workFn;
  function workFn() {
    _providers.push(...provideFn(provide));
  }
};

providers.all = () => {
  return _providers;
};

providers.clear = () => {
  _providers = [];
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