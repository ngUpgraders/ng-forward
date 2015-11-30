// # Directive Decorator
//
// ## Usage
//
// ## Setup
// `parseSelector` takes some simple CSS selector and returns a camelCased version
// of the selector as well as the type of selector it was (element, attribute, or
// CSS class).
import parseSelector from '../util/parse-selector';
// `providerStore` sets up provider information, `componentStore` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerStore, componentStore} from '../writers';
// Takes the information from `config.providers` and turns it into the actual metadata
// needed during app traversal
import {Providers} from './providers';
// Provider parser will need to be registered with Module
import Module from '../classes/module';
import directiveControllerFactory from '../util/directive-controller';
import {inputsMap} from '../properties/inputs-builder';
import {createConfigErrorMessage} from '../util/helpers';

// The type for right now is `directive`. In angular-decorators there was very little
// difference between `@Component` and `@Directive` so they shared a common provider
// parser defined in `../../util/decorate-directive.js`
const TYPE = 'directive';

// ## Decorator Definition
export function Directive(
		{
			selector,
			providers = []
		} :
		{
			selector: string,
			providers?: any[]
		}
	){
	return function(t: any){
		// The only required config is a selector. If one wasn't passed, throw immediately
		if( !selector ) {
			throw new Error('Directive selector must be provided');
		}
	
		// Grab the provider name and selector type by parsing the selector
		let {name, type: restrict} = parseSelector(selector);
	
		if(providers !== undefined && !Array.isArray(providers)){
			throw new TypeError(`Directive providers must be an array`);
		}
	
		// Setup provider information using the parsed selector
		providerStore.set('name', name, t);
		providerStore.set('type', TYPE, t);
	
		// Grab the providers from the config object, parse them, and write the metadata
		// to the target.
		Providers(...providers)(t, `while analyzing Directive '${t.name}' providers`);
	
		// Restrict type must be 'element'
		componentStore.set('restrict', restrict, t);
	}
}

// ## Component Provider Parser
Module.addProvider(TYPE, (target: any, name: string, injects: string[], ngModule: ng.IModule) => {
	// First create an empty object to contain the directive definition object
	let ddo: any = {};

	// Loop through the key/val pairs of metadata and assign it to the DDO
	componentStore.forEach((val, key) => ddo[key] = val, target);

	// If the selector type was not an element, throw an error. Components can only
	// be elements in Angular 2, so we want to enforce that strictly here.
	if(ddo.restrict !== 'A') {
		throw new Error(createConfigErrorMessage(target, ngModule,
				`@Directive selectors can only be attributes, e.g. selector: '[my-directive]'`));
	}

	// Finally add the directive to the raw module
	ngModule.directive(name, ['$injector', ($injector: ng.auto.IInjectorService) => {
		// Component controllers must be created from a factory. Checkout out
		// util/directive-controller.js for more information about what's going on here
		ddo.link = function($scope: any, $element: any, $attrs: any, $requires: any, $transclude: any){
			let locals = { $scope, $element, $attrs, $transclude, $requires };
			return directiveControllerFactory(this, injects, target, ddo, $injector, locals);
		};

		return ddo;
	}]);
});
