'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var Template = function Template() {
	var options = arguments[0] === undefined ? {} : arguments[0];
	return function (t) {
		(0, _utilAnnotate2['default'])(t, '$component');

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