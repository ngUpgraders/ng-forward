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
// 		<textarea ng-model="ctrl.body"></textarea>
// 		<button on-click="ctrl.send()"></textarea>
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
// <send-message subject="Hello, World!" (sent)="sent($event)"></send-message>
// ```
// ## Setup
// `parseSelector` takes some simple CSS selector and returns a camelCased version
// of the selector as well as the type of selector it was (element, attribute, or
// CSS class).
import parseSelector from '../util/parse-selector';
// `providerStore` sets up provider information, `componentStore` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerStore, componentStore, bundleStore} from '../writers';
// Takes the information from `config.providers` and turns it into the actual metadata
// needed during app traversal
import {Providers} from './providers';
// Provider parser will need to be registered with Module
import Module from '../classes/module';
import directiveControllerFactory from '../util/directive-controller';
import {writeMapMulti} from './input-output';
import {inputsMap} from '../properties/inputs-builder';
import events from '../events/events';
import {createConfigErrorMessage} from '../util/helpers';

const TYPE = 'component';

export const componentHooks = {
	_after: [],
	_extendDDO: [],
	_beforeCtrlInvoke: [],
	_afterCtrlInvoke: [],

	after(fn: (target: any, name: string, injects: string[], ngModule: ng.IModule) => any){
		this._after.push(fn)
	},
	extendDDO(fn: (ddo: any, target: any, name: string, injects: string[], ngModule: ng.IModule) => any){
		this._extendDDO.push(fn)
	},
	beforeCtrlInvoke(fn: (caller: any, injects: string[], controller: any, ddo: any, $injector: any, locals: any) => any){
		this._beforeCtrlInvoke.push(fn)
	},
	afterCtrlInvoke(fn: (caller: any, injects: string[], controller: any, ddo: any, $injector: any, locals: any) => any){
		this._afterCtrlInvoke.push(fn)
	}
};

// ## Decorator Definition
export function Component(
		{
			selector,
			controllerAs,
			template,
			templateUrl,
			providers = [],
			inputs = [],
			outputs = [],
			pipes = [],
			directives = []
		} : 
		{
			selector: string,
			controllerAs?: string,
			template?: string,
			templateUrl?: string,
			providers?: any[],
			inputs?: string[],
			outputs?: string[],
			pipes?: any[],
			directives?: any[]
		}
	){
	return function(t: any){
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
		Providers(...providers)(t, `while analyzing Component '${t.name}' providers`);
	
		// Restrict type must be 'element'
		componentStore.set('restrict', restrict, t);
	
		// Components should always create an isolate scope
		componentStore.set('scope', {}, t);
		
		// Since components must have a template, set transclude to true
		componentStore.set('transclude', true, t);
	
		// Inputs should always be bound to the controller instance, not
		// to the scope
		componentStore.set('bindToController', true, t);
	
		// Must perform some basic shape checking on the config object
		[
			['inputs', inputs],
			['providers', providers],
			['directives', directives],
			['outputs', outputs]
		].forEach(([propName, propVal]) => {
			if(propVal !== undefined && !Array.isArray(propVal)){
				throw new TypeError(`Component Decorator Error in "${t.name}": Component ${propName} must be an array`);
			}
		});

		writeMapMulti(t, inputs, 'inputMap');

		let outputMap = writeMapMulti(t, outputs, 'outputMap');
		Object.keys(outputMap).forEach(key => events.add(key));


		// Allow for renaming the controllerAs
		if(controllerAs === '$auto') {
			// ControllerAs is the parsed selector. For example, `app` becomes `app` and
			// `send-message` becomes `sendMessage`
			componentStore.set('controllerAs', name, t);
		} else if (controllerAs) {
			// set to what was provided
			componentStore.set('controllerAs', controllerAs, t);
		} else {
			// set to default of 'ctrl'
			componentStore.set('controllerAs', 'ctrl', t);
		}
	
		// Set a link function
		if(t.link) {
			componentStore.set('link', t.link, t);
		}
	
		// Set a compile function
		if(t.compile){
			componentStore.set('compile', t.compile, t);
		}
	
		View({
			selector,
			template,
			templateUrl,
			pipes,
			directives
		})(t);
	}
}

export function View(
		{
			selector,
			template,
			templateUrl,
			pipes = [],
			directives = []
		} :
		{
			selector: string,
			template?: string,
			templateUrl?: string,
			pipes?: any[],
			directives?: any[]
		}
){
	return function(t: any){
		if(templateUrl)	{
			componentStore.set('templateUrl', templateUrl, t);
		}
		else if(template) {
			componentStore.set('template', template, t);
		}
		else {
			throw new Error(`@Component config must include either a template or a template url for component with selector ${selector} on ${t.name}`);
		}
	
		Providers(...directives)(t, `while analyzing Component '${t.name}' directives`);
		Providers(...pipes)(t, `while analyzing Component '${t.name}' pipes`);
	}
}

Module.addProvider(TYPE, (target: any, name: string, injects: string[], ngModule: ng.IModule) => {
	// First create an empty object to contain the directive definition object
	let ddo: any = {};

	// Loop through the key/val pairs of metadata and assign it to the DDO
	componentStore.forEach((val, key) => ddo[key] = val, target);

	// Get the inputs bindings ahead of time
	let bindProp = angular.version.minor >= 4 ? 'bindToController' : 'scope';
	ddo[bindProp] = inputsMap(ddo.inputMap);

	// If the selector type was not an element, throw an error. Components can only
	// be elements in Angular 2, so we want to enforce that strictly here.
	if(ddo.restrict !== 'E') {
		throw new Error(createConfigErrorMessage(target, ngModule,
				`@Component selectors can only be elements. ` +
				`Perhaps you meant to use @Directive?`));
	}

	// Component controllers must be created from a factory. Checkout out
	// util/directive-controller.js for more information about what's going on here
	controller.$inject = ['$scope', '$element', '$attrs', '$transclude', '$injector'];
	function controller($scope: any, $element: any, $attrs: any, $transclude: any, $injector: any): any{
		let locals = { $scope, $element, $attrs, $transclude };
		return directiveControllerFactory(this, injects, target, ddo, $injector, locals);
	}
	ddo.controller = controller;

	if (ddo.template && ddo.template.replace) {
		ddo.template = ddo.template.replace(/ng-content/g, 'ng-transclude')
	}

	componentHooks._extendDDO.forEach(hook => hook(ddo, target, name, injects, ngModule));

	// Finally add the component to the raw module
	ngModule.directive(name, () => ddo);

	componentHooks._after.forEach(hook => hook(target, name, injects, ngModule));
});