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
import {appWriter, providerWriter} from '../writers';
import {getInjectableName} from '../util/get-injectable-name';
import {Providers} from '../decorators/Providers';

// ## @Inject
// Takes an array of injects
export const Inject = ( ...injects ) => t => {
	const ensureInjectable = inj => {
		if (!providerWriter.get('name', inj) || !providerWriter.get('type', inj)) {
			throw new Error(`Processing "${t.name}" @Inject parameter: "${inj.name || inj.toString()}" is not a valid injectable.
			Please ensure ${inj.name || inj.toString()} is injectable. Valid examples can be:
			 - a string representing an ng1 provider, e.g. '$q'
			 - an @Injectable ng-forward class
			 - a Provider, e.g. provide(SOME_CONFIG, {asValue: 100})`)
		}
		return inj;
	};
	// At the end of the day, Angular 1's DI requires the injection array to be
	// an array of strings. Map over the injects to get the string provider name for
	// each injectable

	var providers = injects
			.filter(inj => typeof inj !== 'string')
			.map(ensureInjectable);

	Providers(...providers)(t);

	let dependencies = injects.map(getInjectableName).filter(n => n !== undefined);

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
