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

function bundle(moduleName, provider) {
  var _Module;

  var otherProviders = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  var getName = function getName(t) {
    return _writers.providerWriter.get('name', t);
  };
  var getProviders = function getProviders(t) {
    return _writers.appWriter.get('providers', t) || [];
  };
  var getModules = function getModules(t) {
    return _writers.appWriter.get('modules', t) || [];
  };

  var modules = new Set();
  var providers = {
    directive: new Map(),
    filter: new Map(),
    provider: new Map(),
    animation: new Map()
  };

  function parseProvider(provider) {
    var name = getName(provider);
    var strategy = _writers.appWriter.get('traversalStrategy', provider);

    if (providers[strategy] && !providers[strategy].has(name)) {
      providers[strategy].set(name, provider);
      getModules(provider).forEach(function (mod) {
        return modules.add(mod);
      });
      getProviders(provider).forEach(parseProvider);
    }
  }

  parseProvider(provider);

  return (_Module = (0, _module3['default'])(moduleName, [].concat(_toConsumableArray(modules.values())))).add.apply(_Module, _toConsumableArray(providers.directive.values()).concat(_toConsumableArray(providers.filter.values()), _toConsumableArray(providers.provider.values()), _toConsumableArray(providers.animation.values()), _toConsumableArray(_utilEvents2['default'].resolve())));
}

module.exports = exports['default'];