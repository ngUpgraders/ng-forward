/* global Event */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _rx = require('rx');

exports['default'] = function (element, $scope, events) {
  var emitters = {};
  var subscriptions = [];

  var create = function create(emitter, eventKey) {
    return emitter.subscribe(function (data) {
      var event = new Event(eventKey, { detail: data });
      element.dispatchEvent(event);
    });
  };

  for (var key in events) {
    var _name = '' + key[0].toUpperCase() + key.slice(1) + 'Emitter';
    emitters[_name] = new _rx.Subject();

    subscriptions.push(create(emitters[_name], events[key]));
  }

  $scope.$on('$destroy', function () {
    subscriptions.forEach(function (subscription) {
      return subscription.dispose();
    });
  });

  return emitters;
};

module.exports = exports['default'];