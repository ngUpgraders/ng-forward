// # Component Decorator
// Provides a robust component decorator that attempts to polyfill many Angular 2
// features while still providing an excellent, testable Angular 1 component strategy
//
// ## Usage
// ```js
// import {Component, EventEmitter, Inject} from 'ng-forward';
// import {Messenger} from '../messenger';
//
// @Component({
// 	selector: 'send-message',
// 	outputs: ['sent'],
// 	inputs: ['messageSubject: subject'],
// 	bind: [Messenger]
// 	template: `
// 		<textarea ng-model="sendMessage.body"></textarea>
// 		<button on-click="sendMessage.send()"></textarea>
// 	`
// })
// @Inject(Messenger)
// export class SendMessage{
// 	this.sent = new EventEmitter();
// 	constructor(Messenger){
// 		this.Messenger = Messenger;
// 		this.message = '';
// 	}
// 	async send(){
// 		let message = await this.Messenger.create(this.subject, this.message);
// 		this.sent.next(message);
// 	}
// }
//```
// In your HTML:
// ```html
// <send-message subject="Hello, World!" on-sent="sent($event)"></send-message>
// ```
// ## Setup
// `parseSelector` takes some simple CSS selector and returns a camelCased version
// of the selector as well as the type of selector it was (element, attribute, or
// CSS class).
import parseSelector from '../util/parse-selector';
// `providerWriter` sets up provider information, `componentWriter` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerStore, componentStore, bundleStore} from '../writers';
// Takes the information from `config.providers` and turns it into the actual metadata
// needed during app traversal
import {Providers} from './providers';
// Provider parser will need to be registered with Module
import Module from '../classes/module';
import parsePropertyMap from '../properties/parse-property-map';
import events from '../events/events';
import directiveControllerFactory from '../util/directive-controller';
import {inputsMap} from '../properties/inputs-builder';

const TYPE = 'component';

// ## Decorator Definition
export const Component = (
		{
			selector,
			controllerAs,
			providers = [],
			inputs = [],
			outputs = [],
			pipes = [],
			directives = [],
			template,
			templateUrl
		} : 
		{
			selector: string,
			controllerAs?: string,
			providers?: any[],
			inputs?: string[],
			outputs?: string[],
			pipes?: any[],
			directives?: any[],
			template?: string,
			templateUrl?: string
		}
	) => (t: any) => {
	// The only required config is a selector. If one wasn't passed, throw immediately
	if( !selector ) {
		throw new Error(`Component Decorator Error in "${t.name}": Component selector must be provided`);
	}

	// Grab the provider name and selector type by parsing the selector
	let {name, type: restrict} = parseSelector(selector);

	// Setup provider information using the parsed selector
	providerStore.set('name', name, t);
	providerStore.set('type', TYPE, t);

	// The appWriter needs the raw selector. This lets it bootstrap the root component
	bundleStore.set('selector', selector, t);

	// Grab the providers from the config object, parse them, and write the metadata
	// to the target.
	Providers(...providers)(t);

	// Restrict type must be 'element'
	componentStore.set('restrict', restrict, t);

	// Components should always create an isolate scope
	componentStore.set('scope', {}, t);
	
	// Since components must have a template, set transclude to true
	componentStore.set('transclude', true, t);

	// Inputs should always be bound to the controller instance, not
	// to the scope
	componentStore.set('bindToController', true, t);

	// TODO: Get this working again
	// Must perform some basic shape checking on the config object
	// ['inputs', 'providers', 'directives', 'outputs'].forEach(property => {
	// 	if(config[property] !== undefined && !Array.isArray(config[property])){
	// 		throw new TypeError(`Component Decorator Error in "${t.name}": Component ${property} must be an array`);
	// 	}
	// });

	// Check for Angular 2 style inputs
	let inputMap = parsePropertyMap(inputs);
	let previousInputMap = componentStore.get('inputMap', t) || {};
	componentStore.set('inputMap', Object.assign({}, previousInputMap, inputMap), t);

	// outputs
	if(outputs.length > 0){
		let outputMap = parsePropertyMap(outputs) || {};
		componentStore.set('outputMap', outputMap, t);
		for(let key in outputMap){
			events.add(outputMap[key]);
		}
	}

	// Allow for renaming the controllerAs
	if(controllerAs) {
		componentStore.set('controllerAs', controllerAs, t);
	}
	else {
		// ControllerAs is the parsed selector. For example, `app` becomes `app` and
		// `send-message` becomes `sendMessage`
		componentStore.set('controllerAs', name, t);
	}

	// Set a link function
	if(t.link) {
		componentStore.set('link', t.link, t);
	}

	// Set a compile function
	if(t.compile){
		componentStore.set('compile', t.compile, t);
	}

	// Extract the view information
	// (View was merged with Component. See https://github.com/angular/angular/pull/4566)
	if(templateUrl)	{
		componentStore.set('templateUrl', templateUrl, t);
	}
	else if(template) {
		componentStore.set('template', template, t);
	}
	else {
		throw new Error(`@Component config must include either a template or a template url for component with selector ${selector} on ${t}`);
	}

	Providers(...directives)(t);
	Providers(...pipes)(t);
};

// ## Component Provider Parser
Module.addProvider(TYPE, (target: any, name: string, injects: string[], ngModule: ng.IModule) => {
	// First create an empty object to contain the directive definition object
	let ddo: any = {};

	componentStore.forEach((val, key) => {
		// Loop through the key/val pairs of metadata and assign it to the DDO
		ddo[key] = val;
	}, target);

	// Get the inputs bindings ahead of time
	let bindProp = angular.version.minor >= 4 ? 'bindToController' : 'scope';
	ddo[bindProp] = inputsMap(ddo.inputMap);

	checkComponentConfig();

	// Component controllers must be created from a factory. Checkout out
	// util/directive-controller.js for more information about what's going on here
	ddo.controller = [
		'$scope', '$element', '$attrs', '$transclude', '$injector',
		function($scope: any, $element: any, $attrs: any, $transclude: any, $injector: any): any{
			let instance = directiveControllerFactory(this, injects, target, ddo, $injector, {
				$scope,
				$element,
				$attrs,
				$transclude
			});

			return instance;
		}
	];

	// Finally add the component to the raw module
	ngModule.directive(name, () => ddo);

	function createConfigErrorMessage(message: string): string {
		return `Processing "${target.name}" in "${ngModule.name}": ${message}`;
	}

	function checkComponentConfig() {
		// If the selector type was not an element, throw an error. Components can only
		// be elements in Angular 2, so we want to enforce that strictly here.
		if(ddo.restrict !== 'E') {
			throw new Error(createConfigErrorMessage(
				`@Component selectors can only be elements. ` +
				`Perhaps you meant to use @Directive?`));
		}
	}
});