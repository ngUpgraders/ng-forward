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
import parseSelector from '../../util/parse-selector';
// `providerWriter` sets up provider information, `componentWriter` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerWriter, componentWriter, appWriter} from '../../writers';
// Takes the information from `config.providers` and turns it into the actual metadata
// needed during app traversal
import {Injectables} from '../injectables';
// Provider parser will need to be registered with Module
import Module from '../../module';
import parsePropertyMap from '../../util/parse-property-map';
import events from '../../util/events';
import directiveControllerFactory from '../../util/directive-controller';
import {inputsMap} from '../../util/inputs-builder';
import extend from 'extend';
import {View} from '../component/view';

const TYPE = 'component';

// ## Decorator Definition
export const Component = componentConfig => t => {
	// The only required config is a selector. If one wasn't passed, throw immediately
	if( !componentConfig.selector ) {
		throw new Error(`Component Decorator Error in "${t.name}": Component selector must be provided`);
	}

	const DEFAULT_CONFIG = {
		inputs: [],
		providers: [],
		directives: [],
		outputs: []
	};

	let config = extend({}, DEFAULT_CONFIG, componentConfig || {});

	// Grab the provider name and selector type by parsing the selector
	let {name, type: restrict} = parseSelector(config.selector);

	// Setup provider information using the parsed selector
	providerWriter.set('name', name, t);
	providerWriter.set('type', TYPE, t);

	// The appWriter needs the raw selector. This lets it bootstrap the root component
	appWriter.set('selector', config.selector, t);

	// Grab the providers from the config object, parse them, and write the metadata
	// to the target.
	Injectables(...config.providers)(t);

	// Restrict type must be 'element'
	componentWriter.set('restrict', restrict, t);

	// Components should always create an isolate scope
	componentWriter.set('scope', {}, t);

	// Inputs should always be bound to the controller instance, not
	// to the scope
	componentWriter.set('bindToController', true, t);


	// Must perform some basic shape checking on the config object
	['inputs', 'providers', 'directives', 'outputs'].forEach(property => {
		if(config[property] !== undefined && !Array.isArray(config[property])){
			throw new TypeError(`Component Decorator Error in "${t.name}": Component ${property} must be an array`);
		}
	});

	// Check for Angular 2 style inputs
	let inputMap = parsePropertyMap(config.inputs);
	let previousInputMap = componentWriter.get('inputMap', t) || {};
	componentWriter.set('inputMap', extend({}, previousInputMap, inputMap), t);

	// outputs
	if(config.outputs.length > 0){
		let outputMap = parsePropertyMap(config.outputs) || {};
		componentWriter.set('outputMap', outputMap, t);
		for(let key in outputMap){
			events.add(outputMap[key]);
		}
	}

	// Allow for renaming the controllerAs
	if(config.controllerAs) {
		componentWriter.set('controllerAs', config.controllerAs, t);
	}
	else {
		// ControllerAs is the parsed selector. For example, `app` becomes `app` and
		// `send-message` becomes `sendMessage`
		componentWriter.set('controllerAs', name, t);
	}

	// Set a link function
	if(t.link) {
		componentWriter.set('link', t.link, t);
	}

	// Set a compile function
	if(t.compile){
		componentWriter.set('compile', t.compile, t);
	}

	// Extract the view information
	// (View was merged with Component. See https://github.com/angular/angular/pull/4566)
	View(config)(t);
};

// ## Component Provider Parser
Module.addProvider(TYPE, (target, name, injects, ngModule) => {
	// First create an empty object to contain the directive definition object
	let ddo = {};

	componentWriter.forEach((val, key) => {
		// Loop through the key/val pairs of metadata and assign it to the DDO
		ddo[key] = val;
	}, target);

	// Get the inputs bindings ahead of time
	if(ddo.controllerAs){
		ddo.bindToController = inputsMap(ddo.inputMap);
	}

	checkComponentConfig();

	// Component controllers must be created from a factory. Checkout out
	// util/directive-controller.js for more information about what's going on here
	ddo.controller = [
		'$scope', '$element', '$attrs', '$transclude', '$injector',
		function($scope, $element, $attrs, $transclude, $injector){
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

	function createConfigErrorMessage(message) {
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

		if(!ddo.templateUrl && !ddo.template)	{
			throw new Error(createConfigErrorMessage(
				`Components must have a template or templateUrl via the @Component or @View decorators`));
		}
	}
});