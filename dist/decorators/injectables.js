// # Injectables Decorator
//
// This decorator takes a list of bindings/injectables and filters it into
// two lists: module names ('ui-router', 'ngAria') and provider classes/functions.
// Then it sets this information using the appWriter, preserving information from
// a parent class. This is used by the `bundle` function for traversal.
//
// It is also worth noting that this injectable is used by `@Component` to handle
// the bindings array that you can pass to it as well as the directives array you
// can pass to `@View`.
//
// Simple decorator, not likely to be used on its own.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('../writers');

var _utilFilterBindings = require('../util/filter-bindings');

var _utilFilterBindings2 = _interopRequireDefault(_utilFilterBindings);

var Injectables = function Injectables() {
  for (var _len = arguments.length, injectables = Array(_len), _key = 0; _key < _len; _key++) {
    injectables[_key] = arguments[_key];
  }

  return function (t) {
    var _filterBindings = (0, _utilFilterBindings2['default'])(injectables);

    var modules = _filterBindings.modules;
    var providers = _filterBindings.providers;

    var parentModules = _writers.appWriter.get('modules', t) || [];
    _writers.appWriter.set('modules', [].concat(_toConsumableArray(modules), _toConsumableArray(parentModules)), t);

    var parentProviders = _writers.appWriter.get('providers', t) || [];
    _writers.appWriter.set('providers', [].concat(_toConsumableArray(providers), _toConsumableArray(parentProviders)), t);
  };
};
exports.Injectables = Injectables;