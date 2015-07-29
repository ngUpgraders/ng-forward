/*global angular,document,global,zone */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bootstrap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bundle = require('./bundle');

var _bundle2 = _interopRequireDefault(_bundle);

var _writers = require('./writers');

function bootstrap(component) {
  var otherProviders = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var ngZone = undefined;
  var selector = _writers.appWriter.get('selector', component);
  var rootElement = document.querySelector(selector);
  (0, _bundle2['default'])(selector, component, otherProviders);

  if (global.zone) {
    ngZone = zone.fork({
      afterTask: function afterTask() {
        var $rootScope = angular.element(rootElement).scope();
        if ($rootScope && !$rootScope.$$phase) {
          $rootScope.$digest();
        }
      }
    });
  }

  if (ngZone) {
    ngZone.run(function () {
      return angular.bootstrap(rootElement, [selector]);
    });
  } else {
    angular.bootstrap(rootElement, [selector]);
  }
}

module.exports = exports['default'];