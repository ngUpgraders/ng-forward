'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _index = require('../index');

var _parseSelector2 = require('./parse-selector');

var _parseSelector3 = _interopRequireDefault(_parseSelector2);

var events = new Set(['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'keydown', 'keyup', 'keypress', 'submit', 'focus', 'blur', 'copy', 'cut', 'paste', 'change', 'dragstart', 'drag', 'dragenter', 'dragleave', 'dragover', 'drop', 'dragend', 'error', 'input', 'load', 'wheel', 'scroll']);

function resolve(ngModule) {
  var directives = [];

  events.forEach(function (event) {
    var selector = '[on-' + event + ']';

    var EventHandler = (function () {
      function EventHandler($parse, $element, $attrs, $scope) {
        var _this = this;

        _classCallCheck(this, _EventHandler);

        this.$scope = $scope;
        this.$element = $element;

        var _parseSelector = (0, _parseSelector3['default'])(selector);

        var attrName = _parseSelector.name;

        this.expression = $parse($attrs[attrName]);
        $element.on(event, function (e) {
          return _this.eventHandler(e);
        });
        $scope.$on('$destroy', function () {
          return _this.onDestroy();
        });
      }

      _createClass(EventHandler, [{
        key: 'eventHandler',
        value: function eventHandler($event) {
          this.expression(this.$scope, { $event: $event });
          this.$scope.$applyAsync();
        }
      }, {
        key: 'onDestroy',
        value: function onDestroy() {
          this.$element.off(event);
        }
      }]);

      var _EventHandler = EventHandler;
      EventHandler = (0, _index.Inject)('$parse', '$element', '$attrs', '$scope')(EventHandler) || EventHandler;
      EventHandler = (0, _index.Directive)({ selector: selector })(EventHandler) || EventHandler;
      return EventHandler;
    })();

    directives.push(EventHandler);
  });

  return directives;
}

function add() {
  for (var _len = arguments.length, customEvents = Array(_len), _key = 0; _key < _len; _key++) {
    customEvents[_key] = arguments[_key];
  }

  customEvents.forEach(function (event) {
    return events.add(event);
  });
}

exports['default'] = { resolve: resolve, add: add };
module.exports = exports['default'];