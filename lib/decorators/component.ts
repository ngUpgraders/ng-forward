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
// `providerStore` sets up provider information, `componentStore` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerStore, componentStore, bundleStore} from '../writers';
// Takes the information from `config.providers` and turns it into the actual metadata
// needed during app traversal
import {Providers} from './providers';
// Provider parser will need to be registered with Module
import Module from '../classes/module';
import directiveControllerFactory from '../util/directive-controller';
import {getInjectableName} from '../util/get-injectable-name';
import {writeMapMulti} from './input-output';
import {inputsMap} from '../properties/inputs-builder';
import events from '../events/events';
import {flatten, createConfigErrorMessage} from '../util/helpers';
import {uiRouterChildConfigsStoreKey, uiRouterConfigsStoreKey, uiRouterResolvedMapStoreKey, IComponentState} from './state-config';

import {IComponentState} from "./state-config";
import IStateProvider = ng.ui.IStateProvider;
import IInjectorService = angular.auto.IInjectorService;

const TYPE = 'component';

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

	componentStore.forEach((val, key) => {
		// Loop through the key/val pairs of metadata and assign it to the DDO
		ddo[key] = val;
	}, target);

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
		let resolvesMap = componentStore.get(uiRouterResolvedMapStoreKey, target);
		//console.log('component.ts, controller::235', `resolvesMap:`, resolvesMap);
		let locals = Object.assign({ $scope, $element, $attrs, $transclude }, resolvesMap);
        return directiveControllerFactory(this, injects, target, ddo, $injector, locals);
	}

	ddo.controller = controller;

	if (ddo.template && ddo.template.replace) {
		// Template Aliases
		ddo.template = ddo.template
				.replace(/ng-content/g, 'ng-transclude')
				.replace(/ng-outlet/g, 'ui-view');
	}

	// Finally add the component to the raw module
	ngModule.directive(name, () => ddo);


    /////////////////
	/* StateConfig */
    /////////////////

	let childStateConfigs: IComponentState[] = componentStore.get(uiRouterChildConfigsStoreKey, target);

	if (childStateConfigs) {
		if (!Array.isArray(childStateConfigs)) {
			throw new TypeError(createConfigErrorMessage(target, ngModule, '@StateConfig param must be an array of state objects.'));
		}

		ngModule.config(['$stateProvider', function($stateProvider: IStateProvider) {
			if (!$stateProvider) return;

			childStateConfigs.forEach((config: IComponentState) => {
				let tagName = providerStore.get('name', config.component);
				let childInjects = bundleStore.get('$inject', config.component);
				let injectedResolves = childInjects ? childInjects.map(getInjectableName) : [];

				//console.log('component.ts, parser::274', `injectedResolves:`, injectedResolves);

				function stateController(...resolves): any {
					let resolvedMap = resolves.reduce((obj, val, i) => {
						obj[injectedResolves[i]] = val;
						return obj;
					}, {});
					//console.log('component.ts, stateController::282', `resolvedMap:`, resolvedMap);
					componentStore.set(uiRouterResolvedMapStoreKey, resolvedMap, config.component);
				}

				config.controller = [...injectedResolves, stateController];
				config.template = config.template || `<${tagName}></${tagName}>`;
				$stateProvider.state(config.name, config);
			});
		}]);
	}
});