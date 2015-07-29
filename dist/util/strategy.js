// # Strategy Utility
// Writers a traversal strategy to the target's metadata. This is used by the bundler
// to determine how to handle the target. Angular 1 supports four known provider types:
// 1. Directives
// 2. Providers (Provider, Service, Factory, etc)
// 3. Filters
// 4. Animations
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = strategy;

var _writers = require('../writers');

function strategy(type, target) {
  _writers.appWriter.set('traversalStrategy', type, target);
}

module.exports = exports['default'];