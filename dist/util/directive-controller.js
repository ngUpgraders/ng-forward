/* global Object */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = directiveControllerFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _propertiesBuilder = require('./properties-builder');

var _eventsBuilder = require('./events-builder');

var _eventsBuilder2 = _interopRequireDefault(_eventsBuilder);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function directiveControllerFactory(injects, controller, ddo) {
  return ['$element', '$scope', '$attrs', '$transclude', '$injector', function ($element, $scope, $attrs, $transclude, $injector) {
    var instance = Object.create(controller.prototype);
    for (var key in ddo.properties) {
      (0, _propertiesBuilder.propertiesBuilder)(instance, key, ddo.properties[key]);
    }
    (0, _extend2['default'])(instance, this);

    var events = (0, _eventsBuilder2['default'])($element[0], $scope, ddo.events || {});

    (0, _extend2['default'])(instance, events);

    $injector.invoke([].concat(_toConsumableArray(injects), [controller]), instance, {
      $element: $element,
      $scope: $scope,
      $attrs: $attrs,
      $transclude: $transclude
    });

    return instance;
  }];
}

module.exports = exports['default'];