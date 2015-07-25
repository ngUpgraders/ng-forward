'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _metawriter = require('metawriter');

var _metawriter2 = _interopRequireDefault(_metawriter);

var baseWriter = new _metawriter2['default']('$ng-decs');
exports.baseWriter = baseWriter;
var providerWriter = new _metawriter2['default']('provider', baseWriter);
exports.providerWriter = providerWriter;
var componentWriter = new _metawriter2['default']('component', baseWriter);
exports.componentWriter = componentWriter;
var appWriter = new _metawriter2['default']('app', baseWriter);
exports.appWriter = appWriter;