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
import {Service} from './providers/service';
// Import the appWriter and providerWriter for reading and writing metadata
import {appWriter, providerWriter} from '../writers';

// ## @Inject
// Takes an array of injects
export const Inject = ( ...injects ) => t => {
	// At the end of the day, Angular 1's DI requires the injection array to be
	// an array of strings. Map over the injects to get the string provider name for
	// each injectable
	let dependencies = injects.map(injectable => {
		// Return it if it is already a string like `'$http'` or `'$state'`
		if(typeof injectable === 'string')
		{
			return injectable;
		}
		// If the injectable is not a string but has provider information, use
		// the provider name. This is set by the collection of provider decorators
		else if(providerWriter.has('type', injectable))
		{
			return providerWriter.get('name', injectable);
		}
		// If it is a function but is missing provider information, apply the Service
		// provider decorator to the function to turn it into a service.
		else if(typeof injectable === 'function')
		{
			Service(injectable);
			return providerWriter.get('name', injectable);
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
	if(appWriter.has('$inject', t))
	{
		let parentInjects = appWriter.get('$inject', t);
		appWriter.set('$inject', [...dependencies, ...parentInjects], t);
	}
	// Otherwise just use the dependencies array as the $inject array.
	else
	{
		appWriter.set('$inject', dependencies, t);
	}
};
