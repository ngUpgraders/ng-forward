'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var type = 'provider';

var Provider = function Provider(t) {
	_annotate2['default'](t, '$provider', { name: t.name, type: type });
};

exports.Provider = Provider;
_Module.Module.registerProvider(type, function (provider, module) {
	module.provider(provider.$provider.name, provider);
});