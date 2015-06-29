'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _decorators = require('./decorators');

var decorators = _interopRequireWildcard(_decorators);

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _utilDecorate = require('./util/decorate');

var _utilDecorate2 = _interopRequireDefault(_utilDecorate);

exports.decorators = decorators;
exports.decorate = _utilDecorate2['default'];
exports.module = _module3['default'];