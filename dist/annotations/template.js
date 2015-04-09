'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var Template = function Template() {
	var options = arguments[0] === undefined ? {} : arguments[0];
	return function (t) {
		_annotate2['default'](t, '$component');

		if (t.$component.templateUrl) {
			delete t.$component.templateUrl;
		}
		if (t.$component.template) {
			delete t.$component.template;
		}

		if (options.url) {
			t.$component.templateUrl = options.url;
		} else if (options.inline) {
			t.$component.template = options.inline;
		}
	};
};
exports.Template = Template;