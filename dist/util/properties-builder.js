// This is a simple clone of @hannahhoward's a1atrscipt implementation of custom
// properties. See: https://github.com/hannahhoward/a1atscript/blob/master/src/a1atscript/ng2Directives/PropertiesBuilder.js
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.propertiesMap = propertiesMap;
exports.propertiesBuilder = propertiesBuilder;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BIND_PREFIX = '_=_';
var STRING_PREFIX = '_@_';

function propertiesMap(properties) {
  var definition = {};

  for (var key in properties) {
    var property = properties[key];
    definition['' + STRING_PREFIX + key] = '@' + property;
    definition['' + BIND_PREFIX + key] = '=?bind' + property[0].toUpperCase() + property.slice(1);
  }

  return definition;
}

function propertiesBuilder(obj, key, property) {
  var _Object$defineProperties;

  var genericSetter = function genericSetter(use, errorOn) {
    return function (value) {
      this.__using_binding__ = this.__using_binding__ || {};
      if (this.__using_binding__[key] === errorOn) {
        if (value !== undefined) {
          throw new Error('Cannot use bind-' + property + ' and ' + property + ' simultaneously');
        }

        return;
      }

      if (value !== undefined) {
        this.__using_binding__[key] = use;
      }

      this[key] = value;
    };
  };

  Object.defineProperties(obj, (_Object$defineProperties = {}, _defineProperty(_Object$defineProperties, '' + BIND_PREFIX + key, {
    enumerable: true,
    configurable: true,
    set: genericSetter(BIND_PREFIX, STRING_PREFIX),
    get: function get() {
      return this[key];
    }
  }), _defineProperty(_Object$defineProperties, '' + STRING_PREFIX + key, {
    enumerable: true,
    configurable: true,
    set: genericSetter(STRING_PREFIX, BIND_PREFIX),
    get: function get() {
      return this[key];
    }
  }), _Object$defineProperties));
}