/*global angular,document */
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
  var otherProviders = arguments[1] === undefined ? [] : arguments[1];

  var selector = _writers.appWriter.get('selector', component);
  (0, _bundle2['default'])(selector, component, otherProviders);
  angular.bootstrap(document.querySelector(selector), [selector]);
}

module.exports = exports['default'];