'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = filterBindings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _writers = require('../writers');

var _flattenArray = require('./flatten-array');

var _flattenArray2 = _interopRequireDefault(_flattenArray);

var STRING_TEST = function STRING_TEST(a) {
  return typeof a === 'string';
};
var PROVIDER_TEST = function PROVIDER_TEST(a) {
  return typeof a === 'function' && _writers.providerWriter.has('name', a);
};

function filterBindings(rawBindings) {
  var bindings = (0, _flattenArray2['default'])(rawBindings);

  var modules = bindings.filter(STRING_TEST);
  var providers = bindings.filter(PROVIDER_TEST);

  if (bindings.filter(STRING_TEST).filter(PROVIDER_TEST).length > 0) {
    throw new Error('Unidentified injectable type. Sorry this message is not clearer!');
  }

  return { modules: modules, providers: providers };
}

module.exports = exports['default'];