'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

    _writers.appWriter.set('modules', stringInjects, t);
    _writers.appWriter.set('providers', providerInjects, t);
  };
};
exports.Injectables = Injectables;