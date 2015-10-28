import { provide } from '../classes/provider';

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

export const allProviders = () => {
  return _providers;
};

export const clearProviders = () => {
  _providers = [];
};


// helpers for mocha and jasmine beforeEach
var currentSpec = null;
function isSpecRunning() {
  return !!currentSpec;
}
//noinspection TypeScriptUnresolvedVariable
if (window.jasmine || window.mocha) {
  //noinspection TypeScriptUnresolvedVariable
  (window.beforeEach || window.setup)(function () {
    currentSpec = this;
  });
  //noinspection TypeScriptUnresolvedVariable
  (window.afterEach || window.teardown)(function () {
    currentSpec = null;
  });
}