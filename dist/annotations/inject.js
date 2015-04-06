"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Inject = Inject;

function Inject() {
	for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
		dependencies[_key] = arguments[_key];
	}

	return function (t) {
		var allDependencies = [];

		if (t.$inject) {
			allDependencies.concat(t.$inject);
		}

		allDependencies.concat(dependencies);

		t.$inject = allDependencies;
	};
}