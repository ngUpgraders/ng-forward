/* global setTimeout */
// # EventEmitter class
// Simple re-implementation of Angular 2's [EventEmitter](https://github.com/angular/angular/blob/master/modules/angular2/src/facade/async.ts#L97)
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rx = require('rx');

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._subject = new _rx.Subject();
    this._immediateScheduler = _rx.Scheduler.immediate;
  }

  _createClass(EventEmitter, [{
    key: 'observer',
    value: function observer(generator) {
      return this._subject.observeOn(this._immediateScheduler).subscribe(function (value) {
        return setTimeout(function () {
          return generator.next(value);
        });
      }, function (error) {
        return generator['throw'] ? generator['throw'](error) : null;
      }, function () {
        return generator['return'] ? generator['return']() : null;
      });
    }
  }, {
    key: 'toRx',
    value: function toRx() {
      return this._subject;
    }
  }, {
    key: 'next',
    value: function next(value) {
      this._subject.onNext(value);
    }
  }, {
    key: 'throw',
    value: function _throw(error) {
      this._subject.onError(error);
    }
  }, {
    key: 'return',
    value: function _return() {
      this._subject.onCompleted();
    }
  }]);

  return EventEmitter;
})();

exports.EventEmitter = EventEmitter;