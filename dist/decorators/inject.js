// # Inject Decorator
// Decorator for adding dependencies to a provider
//
// ## Usage
// Inject string-based dependencies, decorated classes, or classes directly as services
// ```js
// import {Inject} from 'ng-forard';
//
// class SomeService{ }
//
// @Inject('$q', SomeService)
// class AnotherService{ }
// ```
//
// ## Intro
// Import the `@Service` decorator. We'll apply it to functions/classes that are
// injected that are missing provider metadata. Convenience!
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _providersService = require('./providers/service');

// Import the appWriter and providerWriter for reading and writing metadata

var _writers = require('../writers');

// ## @Inject
// Takes an array of injects
var Inject = function Inject() {
	for (var _len = arguments.length, injects = Array(_len), _key = 0; _key < _len; _key++) {
		injects[_key] = arguments[_key];
	}

	return function (t) {
		// At the end of the day, Angular 1's DI requires the injection array to be
		// an array of strings. Map over the injects to get the string provider name for
		// each injectable
		var dependencies = injects.map(function (injectable) {
			// Return it if it is already a string like `'$http'` or `'$state'`
			if (typeof injectable === 'string') {
				return injectable;
			}
			// If the injectable is not a string but has provider information, use
			// the provider name. This is set by the collection of provider decorators
			else if (_writers.providerWriter.has('type', injectable)) {
					return _writers.providerWriter.get('name', injectable);
				}
				// If it is a function but is missing provider information, apply the Service
				// provider decorator to the function to turn it into a service.
				else if (typeof injectable === 'function') {
						(0, _providersService.Service)(injectable);
						return _writers.providerWriter.get('name', injectable);
					}
		});

		// If there is already an $inject array, assume that it was set by a parent class.
		// The resultant $inject array should be a concat of local dependencies and parent
		// injects.
		// ```js
		// @Inject('$q', '$http', '$interval')
		// class Parent{ ... }
		//
		// @Inject('$timeout')
		// class Child extends Parent{
		// 	constructor($timeout, ...parentDependencies){
		// 		super(...parentDependencies);
		// 	}
		// }
		// ```
		if (_writers.appWriter.has('$inject', t)) {
			var parentInjects = _writers.appWriter.get('$inject', t);
			_writers.appWriter.set('$inject', [].concat(_toConsumableArray(dependencies), _toConsumableArray(parentInjects)), t);
		}
		// Otherwise just use the dependencies array as the $inject array.
		else {
				_writers.appWriter.set('$inject', dependencies, t);
			}
	};
};
exports.Inject = Inject;