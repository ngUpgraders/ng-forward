// # Pipe Decorator
// While not even close to a complete polyfill of Angular 2 pipes, for pure
// filter functions you can begin writing them using pipe-like syntax.
//
// ## Usage
// ```js
// @Pipe('toUpperCase')
// class ToUpperCase{
// 	supports(input){
// 		return typeof input === 'string';
// 	}
//
// 	transform(input){
// 		return input.toUpperCase();
// 	}
// }
// ```
// And in your templates:
// ```html
// {{ vm.name | toUpperCase }}
// ```
// ## Setup
// This is a provider-type decorator, so we'll need to register it with Module
import Module from '../classes/module';
// The only configurable information it needs is an optional name, so we'll
// generate the decorator with our decorator factory.
import decoratorFactory from '../util/decorator-factory';

// ## Decorator Definition
// Provider type for for this decorator is `pipe`, though it is most analogous
// to an Angular 1 filter.
const TYPE = 'pipe';

// The decorator itself. Note that while the name is technically optional,
// with pipes you will almost _always_ wants to provide a name to use in your
// templates that is different from the class name. This keeps your code uglify-proof.
export const Pipe: (any?: any) => any = decoratorFactory(TYPE);

// ## Provider Parser
Module.addProvider(TYPE, (provider: any, name: string, injects: string[], ngModule: ng.IModule) => {
	// This provider recipe uses Angular 1 filters
	ngModule.filter(name, [...injects, (...dependencies: any[]) => {
		// First, create an instance of the provider by passing in injected dependencies
		let pipe: any = new provider(...dependencies);

		// All pipes must implement a `transform` method. These __must__ be pure
		// functions (for some input, it must always return the same output)
		if(!pipe.transform){
			throw new Error('Filters must implement a transform method');
		}

		// This is the Angular 1 filter itself
		return (input: any, ...params: any[]) => {
			// Pass the input to the pipe to see if it conforms to the pipe's type
			// spec
			if(pipe.supports && !pipe.supports(input)){
				throw new Error(`Filter ${name} does not support ${input}`);
			}

			// Pass all inputs and parameters to the filter returning the output
			return pipe.transform(input, ...params);
		}
	}]);
});
