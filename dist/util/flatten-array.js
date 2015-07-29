// # Flatten Array Utility
// Takes a nested array and flattens it
//
// ## Usage
// `flatten([1, [2, 3], [[4]], [[[[5, 6]]]]]);`
// Output: `[1, 2, 3, 4, 5, 6]`

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = flatten;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function flatten(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Cannot flatten non-array values');
  }

  var values = [];

  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      values.push.apply(values, _toConsumableArray(flatten(arr[i])));
    } else {
      values.push(arr[i]);
    }
  }

  return values;
}

module.exports = exports['default'];