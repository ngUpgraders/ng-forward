"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Inject = function Inject() {
	for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
		dependencies[_key] = arguments[_key];
	}

	return function (t) {
		var _t$$inject;

		t.$inject = t.$inject || [];

		(_t$$inject = t.$inject).push.apply(_t$$inject, dependencies);
	};
};
exports.Inject = Inject;