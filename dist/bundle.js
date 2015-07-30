// # Bundle function
// Takes a root decorated class and generates a Module from it

// ## Setup
// All information about traversing a provider is written by the appWriter
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bundle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('./writers');

// The bundle is going to be generating a Module, so we'll need this

var _module2 = require('./module');

// Events is a utility for generating semi-dynamic events. It will be generating
// a lot of attribute directives for event handling.

var _module3 = _interopRequireDefault(_module2);

var _utilEvents = require('./util/events');

// Takes an array of bindings and separates it into decorated classes and string
// names. Usually these string names are the names of angular modules.

var _utilEvents2 = _interopRequireDefault(_utilEvents);

var _utilFilterBindings = require('./util/filter-bindings');

// ## Bundle
// The bundle function. Pass it the name of the module you want to generate, the root
// provider, and an option list of additional bindings the provider may need to
// successfully bootstrap. The idea is that you only need to provide bindings if you
// are testing a component or service in isolation

var _utilFilterBindings2 = _interopRequireDefault(_utilFilterBindings);

function bundle(moduleName, provider) {
  var _Module;

  var bindings = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  // Get a list of decorated classes that some decorated class `t` depends on
  var getProviders = function getProviders(t) {
    return _writers.appWriter.get('providers', t) || [];
  };
  // Get a list of `angular.module` names some decorated class `t` depends on
  var getModules = function getModules(t) {
    return _writers.appWriter.get('modules', t) || [];
  };

  // Kick the process off by getting the list of `angular.module`s and decorated
  // classes the root provider requires

  var _filterBindings = (0, _utilFilterBindings2['default'])([provider].concat(_toConsumableArray(bindings)));

  // This set will be used to hold providers as they are traversed.
  // Since sets can only contain unique values, we'll use this set to see if the provider
  // has already been traversed. This will prevent circular references and providers
  // being added multiple times.
  var startingModules = _filterBindings.modules;
  var startingProviders = _filterBindings.providers;
  var providers = new Set();
  // Create a new set of `angular.module`s based on the modules required by the
  // root provider
  var modules = new Set(startingModules);

  // Recursive parsing function. Takes a provider and adds modules to the modules
  // set. Then traverses the providers it depends on.
  function parseProvider(provider) {
    // Check to see if the provider is defined and hasn't been traversed already
    if (provider && !providers.has(provider)) {
      // Add the provider to the providers set
      providers.add(provider);
      // Add the moduels to the modules set
      getModules(provider).forEach(function (mod) {
        return modules.add(mod);
      });
      // Parse the inner providers
      getProviders(provider).forEach(parseProvider);
    }
  }

  // Take the array of starting providers and begin the traversal
  startingProviders.forEach(parseProvider);

  // Create our Module and add all of the providers we found during traversal
  return (_Module = (0, _module3['default'])(moduleName, [].concat(_toConsumableArray(modules.values())))).add.apply(_Module, _toConsumableArray(_utilEvents2['default'].resolve()).concat(_toConsumableArray(providers.values())));
}

module.exports = exports['default'];