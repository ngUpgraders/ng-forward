'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moduleModule = require('../module/module');

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var type = 'provider';

var Provider = function Provider(t) {
	(0, _utilAnnotate2['default'])(t, '$provider', { name: t.name, type: type });
};

exports.Provider = Provider;
_moduleModule.Module.registerProvider(type, function (provider, module) {
	module.provider(provider.$provider.name, provider);
});