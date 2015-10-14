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
// Import the appWriter for reading and writing metadata
import {appWriter} from '../writers';
import {getInjectableName} from '../util/get-injectable-name';

// ## @Inject
// Takes an array of injects
export const Inject = ( ...injects ) => t => {
	// At the end of the day, Angular 1's DI requires the injection array to be
	// an array of strings. Map over the injects to get the string provider name for
	// each injectable
	let dependencies = injects.map(getInjectableName);

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
	if (appWriter.has('$inject', t)) {
		let parentInjects = appWriter.get('$inject', t);
		appWriter.set('$inject', [...dependencies, ...parentInjects], t);
	}
	// Otherwise just use the dependencies array as the $inject array.
	else {
		appWriter.set('$inject', dependencies, t);
	}
};
