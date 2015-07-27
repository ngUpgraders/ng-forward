'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bundle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('./writers');

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _utilEvents = require('./util/events');

var _utilEvents2 = _interopRequireDefault(_utilEvents);

function bundle(moduleName, component) {
  var _Module;

  var otherProviders = arguments[2] === undefined ? [] : arguments[2];

  var name = function name(t) {
    return _writers.providerWriter.get('name', t);
  };

  var directives = new Map();
  var providers = new Map();
  var modules = [];

  function parseComponentTree(component) {
    directives.set(name(component), component);

    (_writers.appWriter.get('directives', component) || []).filter(function (directive) {
      return !directives.has(name(directive));
    }).forEach(parseComponentTree);

    (_writers.appWriter.get('providers', component) || []).filter(function (provider) {
      return !providers.has(name(provider));
    }).map(function (provider) {
      return [name(provider), provider];
    }).forEach(function (provider) {
      return providers.set.apply(providers, _toConsumableArray(provider));
    });

    modules.push.apply(modules, _toConsumableArray(_writers.appWriter.get('modules', component) || []));
  }

  function parseProviderTree(provider) {
    if (!providers.has(name(provider))) {
      providers.set(name(provider), provider);
    }

    (_writers.appWriter.get('providers', provider) || []).filter(function (provider) {
      return !providers.has(name(provider));
    }).forEach(parseProviderTree);

    modules.push.apply(modules, _toConsumableArray(_writers.appWriter.get('modules', provider) || []));
  }

  parseComponentTree(component);
  providers.forEach(parseProviderTree);

  return (_Module = (0, _module3['default'])(moduleName, modules)).add.apply(_Module, _toConsumableArray(directives.values()).concat(_toConsumableArray(providers.values()), _toConsumableArray(otherProviders), _toConsumableArray(_utilEvents2['default'].resolve())));
}

module.exports = exports['default'];