// # Directive Decorator
//
// ## Usage
//
// ## Setup
// `parseSelector` takes some simple CSS selector and returns a camelCased version
// of the selector as well as the type of selector it was (element, attribute, or
// CSS class).
import parseSelector from '../../util/parse-selector';
// `providerWriter` sets up provider information, `componentWriter` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerWriter, componentWriter} from '../../writers';
// Takes the information from `config.bindings` and turns it into the actual metadata
// needed during app traversal
import {Injectables} from '../injectables';
// Provider parser will need to be registered with Module
import Module from '../../module';
import directiveControllerFactory from '../../util/directive-controller';
import {inputsMap} from '../../util/inputs-builder';
import extend from 'extend';

// The type for right now is `directive`. In angular-decorators there was very little
// difference between `@Component` and `@Directive` so they shared a common provider
// parser defined in `../../util/decorate-directive.js`
const TYPE = 'directive';

// ## Decorator Definition
export const Directive = componentConfig => t => {
	// The only required config is a selector. If one wasn't passed, throw immediately
	if( !componentConfig.selector ) {
		throw new Error('Directive selector must be provided');
	}

	const DEFAULT_CONFIG = {
		bindings: []
	};

	let config = extend({}, DEFAULT_CONFIG, componentConfig || {});

	// Grab the provider name and selector type by parsing the selector
	let {name, type: restrict} = parseSelector(config.selector);

	// If the selector type was not an element, throw an error. Components can only
	// be elements in Angular 2, so we want to enforce that strictly here.
	if(restrict !== 'A') {
		throw new Error('@Directive selectors can only be attributes');
	}

	// Must perform some basic shape checking on the config object
	['inputs', 'bindables', 'directives', 'outputs'].forEach(property => {

	});
	if(config.bindings !== undefined && !Array.isArray(config.bindings)){
		throw new TypeError(`Directive bindings must be an array`);
	}

	// Setup provider information using the parsed selector
	providerWriter.set('name', name, t);
	providerWriter.set('type', TYPE, t);

	// Grab the bindings from the config object, parse them, and write the metadata
	// to the target.
	Injectables(...config.bindings)(t);

	// Restrict type must be 'element'
	componentWriter.set('restrict', restrict, t);
};

// ## Component Provider Parser
Module.addProvider(TYPE, (target, name, injects, ngModule) => {
	// First create an empty object to contain the directive definition object
	let ddo = {};

	componentWriter.forEach((val, key) => {
		// Loop through the key/val pairs of metadata and assign it to the DDO
		ddo[key] = val;
	}, target);

	// Get the input bindings ahead of time
	if(ddo.controllerAs){
		ddo.bindToController = inputsMap(ddo.inputs);
	}

	// Finally add the directive to the raw module
	ngModule.directive(name, ['$injector', ($injector) => {
		// Component controllers must be created from a factory. Checkout out
		// util/directive-controller.js for more information about what's going on here
		ddo.link = function($scope, $element, $attrs, $requires, $transclude){
			return directiveControllerFactory(this, injects, target, ddo, $injector, {
				$scope,
				$element,
				$attrs,
				$transclude,
				$requires
			});
		};

		return ddo;
	}]);
});
