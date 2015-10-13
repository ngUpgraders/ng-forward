import { Binding, bind } from '../util/binding';

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
    Binding.bindings.push(...bindFn(bind));
  }
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