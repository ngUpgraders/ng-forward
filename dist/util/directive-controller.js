/* global Object */
// # Directive Controller Factory
// While we want to use the component controller, we need a way to add our own
// properties to the controller instance before the constructor is called. We also
// want to do this in the context of Angular's DI so that we can access the $element
// for events and $filter for properties.
//
// ## Setup
// We'll need a1atscript's propertiesBuilder for generating the property definitions
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = directiveControllerFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _propertiesBuilder = require('./properties-builder');

// Also need the eventsBuilder for creating event emittors

var _eventsBuilder = require('./events-builder');

// Finally extend for extending the instance of the controller

var _eventsBuilder2 = _interopRequireDefault(_eventsBuilder);

var _extend = require('extend');

// ## Factory
// Needs the injection array, the controller class, and the directive definition
// object in order to generate the controller

var _extend2 = _interopRequireDefault(_extend);

function directiveControllerFactory(injects, controller, ddo) {
  return [
  // Angular provides all of these as locals when it instantiates the controller
  // (excpet for `$injector`). We need to capture them so that we can re-provide
  // them as locals when we actually instantiate the real controller.
  '$element', '$scope', '$attrs', '$transclude', '$injector',
  // It is important to note that Angular will use the prototype of this function
  function ($element, $scope, $attrs, $transclude, $injector) {
    // Create an instance of the controller without calling its constructor
    var instance = Object.create(controller.prototype);
    // Use a1atscript's propertiesBuilder to add the getters/setters than sugar
    // over `=` and `@` bindings
    for (var key in ddo.properties) {
      (0, _propertiesBuilder.propertiesBuilder)(instance, key, ddo.properties[key]);
    }
    // Remember, angular has alrady set those bindings on the prototype of our
    // generated function. Now we need to extend them onto our instance. important
    // to extend after building the properties that way we fire the setters
    (0, _extend2['default'])(instance, this);

    // Events work similarly, but they need the raw $element and the $scope for
    // destroying event observables.
    var events = (0, _eventsBuilder2['default'])($element[0], $scope, ddo.events || {});
    (0, _extend2['default'])(instance, events);

    // Finally, invoke the constructor using the injection array and the captured
    // locals
    $injector.invoke([].concat(_toConsumableArray(injects), [controller]), instance, {
      $element: $element,
      $scope: $scope,
      $attrs: $attrs,
      $transclude: $transclude
    });

    // Return the controller instance
    return instance;
  }];
}

module.exports = exports['default'];
// to add properties from `bindToController`.