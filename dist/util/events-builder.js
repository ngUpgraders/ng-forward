/* global Event */
// # Events Builder
// Takes an instance of a controller and detects event emitters. Subscribes
// to the emitters to make event dispatching a breeze.
//
// ## Setup
// Import the EventEmitter class
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventEmitter = require('./event-emitter');

// ## Function
// Takes an instance of the controller, element of the component for dispatching
// the event, $scope for disposing of subscriptions, and a map of the emitters and
// events that might be on the instance

exports['default'] = function (instance, element, $scope, events) {
  // Collection of subscriptions we'll generate
  var subscriptions = [];

  // Create a subscription to the event emitter. When we observe a new value,
  // dispatch a bubbling event onto the element
  var create = function create(eventKey, emitter) {
    return emitter.observer({
      next: function next(data) {
        var event = new Event(eventKey, { detail: data, bubbles: true });
        element.dispatchEvent(event);
      }
    });
  };

  // Iterate over the emmitterKeys to detect if the controller created any
  // EventEmitters. If it did, subscribe to the emitter to dispatch the events.
  for (var key in events) {
    if (instance[key] && instance[key] instanceof _eventEmitter.EventEmitter) {
      subscriptions.push(create(events[key], instance[key]));
    }
  }

  // Once the component's scope has been destroyed, tear down the subscriptions.
  $scope.$on('$destroy', function () {
    subscriptions.forEach(function (subscription) {
      return subscription.dispose();
    });
  });
};

module.exports = exports['default'];