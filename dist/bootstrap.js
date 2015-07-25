/*global angular,document */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bootstrap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('./writers');

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

function bootstrap(component) {
  var _Module;

  var directives = [component];
  var modules = [];
  var providers = [];

  function parseTree(component) {
    var innerDirectives = _writers.appWriter.get('directives', component) || [];
    directives.push.apply(directives, _toConsumableArray(innerDirectives));
    innerDirectives.forEach(parseTree);

    var innerModules = _writers.appWriter.get('modules', component) || [];
    modules.push.apply(modules, _toConsumableArray(innerModules));

    var innerProviders = _writers.appWriter.get('providers', component) || [];
    providers.push.apply(providers, _toConsumableArray(innerProviders));
  }

  parseTree(component);
  var selector = _writers.appWriter.get('selector', component);
  (_Module = (0, _module3['default'])(selector, modules)).add.apply(_Module, directives.concat(providers));

  angular.bootstrap(document.querySelector(selector), [selector]);
}

module.exports = exports['default'];