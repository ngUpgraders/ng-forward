"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Template = function Template(options) {
	return function (t) {
		t.$component = t.$component || {};

		if (options.url) {
			t.$component.templateUrl = options.url;
		} else if (options.inline) {
			t.$component.template = options.inline;
		}
	};
};
exports.Template = Template;