/*global angular,document,global,zone */
// # Bootstrap function
// Provides sugar over the bundle function and actually bootstrapping the application.
//
// ## Usage
// Just like Angular 2, create a root component and use bootstrap to kick it off:
// ```js
// import {Component, View, bootstrap} from 'ng-forward';
//
// @Component({
//   selector: 'app',
//   bindings: ['ui-router', 'ngAria', MyService]
// })
// @View({
//   template: 'Hello, world!',
//   directives: [/* Add components/directives here */]
// })
// class App{ }
//
// bootstrap(App);
// ```
// HTML:
// ```js
// <html>
// <body>
//   <app></app> <!-- app will be bootstrapped here -->
// </body>
// </html>
// ```
//
// ## Intro
// We'll need the bundle function to create our bundle from the root component
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bootstrap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bundle = require('./bundle');

// We'll need the appWriter to get the selector metadata off of the root component

var _bundle2 = _interopRequireDefault(_bundle);

var _writers = require('./writers');

// ## Bootstrap

function bootstrap(component) {
  var otherProviders = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  // Holder for a potential zone
  var ngZone = undefined;
  // Selector of the root component. In the above example, this would be `app`
  var selector = _writers.appWriter.get('selector', component);
  // The actual element we'll be using to bootstrap the application
  var rootElement = document.querySelector(selector);
  // Create our bundle from the root component. Note that the name of this
  // module is also going to be the selector of the root component
  (0, _bundle2['default'])(selector, component, otherProviders);

  // This is still early proof of concept code for using zone.js for change
  // detection
  if (global.zone) {
    // If you've imported zone.js into your project, create a new zone
    ngZone = zone.fork({
      afterTask: function afterTask() {
        // After some task has been completed, get the $rootScope off of the element
        // we used to bootstrap the application. Then, if a $digest cycle has not
        // already started kick one off. This lets you use ES6 Promises instead of $q
        // as well as a whole host of vanilla async stuff (setTimeout, setInterval, fetch, etc)
        var $rootScope = angular.element(rootElement).scope();
        if ($rootScope && !$rootScope.$$phase) {
          $rootScope.$digest();
        }
      }
    });
  }

  // If we were able to create the ngZone, bootstrap the app in the context of the
  // zone
  if (ngZone) {
    ngZone.run(function () {
      return angular.bootstrap(rootElement, [selector]);
    });
  }
  // Otherwise, bootstrap it as normal
  else {
      angular.bootstrap(rootElement, [selector]);
    }
}

module.exports = exports['default'];