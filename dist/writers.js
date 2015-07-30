// # Metawriters
// metawriter is a simple utility written by me (@mikeryan52) for writing
// namespaced metadata to a class. Metawriter wraps the `Reflect.metadata` polyfill
// written by the TypeScript guys
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _metawriter = require('metawriter');

// This is the base writer. Rarely used other than to ensure that the other writers
// are under this library's namespace. Prevents collisions with other metadata-based
// libraries.

var _metawriter2 = _interopRequireDefault(_metawriter);

var baseWriter = new _metawriter2['default']('$ng-decs');
// The providerWriter is responsible for setting the name and type of provider a
// class will become after parsed
exports.baseWriter = baseWriter;
var providerWriter = new _metawriter2['default']('provider', baseWriter);
// The componentWriter is used to create the directive definition object.
exports.providerWriter = providerWriter;
var componentWriter = new _metawriter2['default']('component', baseWriter);
// The appWriter is a new writer for ng-forward that writes information about how
// the bundle function should traverse a class. It sets the modules, providers, and
// traversal strategy that the class requires.
exports.componentWriter = componentWriter;
var appWriter = new _metawriter2['default']('app', baseWriter);
exports.appWriter = appWriter;