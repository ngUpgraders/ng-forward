'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('../writers');

var Injectables = function Injectables() {
  for (var _len = arguments.length, injectables = Array(_len), _key = 0; _key < _len; _key++) {
    injectables[_key] = arguments[_key];
  }

  return function (t) {
    var STRING_TEST = function STRING_TEST(a) {
      return typeof a === 'string';
    };
    var PROVIDER_TEST = function PROVIDER_TEST(a) {
      return typeof a === 'function' && _writers.providerWriter.has('name', a);
    };

    var stringInjects = injectables.filter(STRING_TEST);
    var providerInjects = injectables.filter(PROVIDER_TEST);

    if (injectables.filter(STRING_TEST).filter(PROVIDER_TEST).length > 0) {
      throw new Error('Unidentified injectable type. Sorry this message is not clearer!');
    }

    var modules = _writers.appWriter.get('modules', t) || [];
    _writers.appWriter.set('modules', [].concat(_toConsumableArray(modules), _toConsumableArray(stringInjects)), t);
    var providers = _writers.appWriter.get('providers', t) || [];
    _writers.appWriter.set('providers', [].concat(_toConsumableArray(providers), _toConsumableArray(providerInjects)), t);
  };
};
exports.Injectables = Injectables;