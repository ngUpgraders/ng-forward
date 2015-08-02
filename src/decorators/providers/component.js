// # Component Decorator
// Provides a robust component decorator that attempts to polyfill many Angular 2
// features while still providing an excellent, testable Angular 1 component strategy
//
// ## Usage
// ```js
// import {Component, View, EventEmitter, Inject} from 'ng-forward';
// import {Messenger} from '../messenger';
//
// @Component({
// 	selector: 'send-message',
// 	events: ['sent'],
// 	properties: ['messageSubject: subject'],
// 	bind: [Messenger]
// })
// @View({
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
// A more general config-to-ddo utility. Creates some reusability between
// `@Component` and `@Directive`
import decorateDirective from '../../util/decorate-directive';
// `providerWriter` sets up provider information, `componentWriter` writes the DDO,
// and `appWriter` sets up app traversal/bootstrapping information.
import {providerWriter, componentWriter, appWriter} from '../../writers';
// Takes the information from `config.bindings` and turns it into the actual metadata
// needed during app traversal
import {Injectables} from '../injectables';

// The type for right now is `directive`. In angular-decorators there was very little
// difference between `@Component` and `@Directive` so they shared a common provider
// parser defined in `../../util/decorate-directive.js`
const TYPE = 'directive';

// ## Decorator Definition
export const Component = config => t => {
	// The only required config is a selector.
	if( !config.selector )
	{
		throw new Error('Component selector must be provided');
	}

	// Grab the provider name and selector type by parsing the selector
	let {name, type: restrict} = parseSelector(config.selector);

	// If the selector type was not an element, throw an error. Components can only
	// be elements in Angular 2, so we want to enforce that strictly here.
	if(restrict !== 'E')
	{
		throw new Error('@Component selectors can only be elements. Perhaps you meant to use @Directive?');
	}

	// Setup provider information using the parsed selector
	providerWriter.set('name', name, t);
	providerWriter.set('type', TYPE, t); // NOTE: `TYPE` here is `'directive'`

	// The appWriter needs the raw selector. This lets it bootstrap the root component
	appWriter.set('selector', config.selector, t);

	// Grab the bindings from the config object, parse them, and write the metadata
	// to the target.
	let bindings = config.bindings || [];
	Injectables(...bindings)(t);

	// Sensible defaults for components
	if( !componentWriter.has('restrict', t) )
	{
		// Restrict type must be 'element'
		componentWriter.set('restrict', restrict, t);
	}
	if( !componentWriter.has('scope', t) )
	{
		// Components should always create an isolate scope
		componentWriter.set('scope', {}, t);
	}
	if( !componentWriter.has('bindToController', t) )
	{
		// Properties should always be bound to the controller instance, not
		// to the scope
		componentWriter.set('bindToController', true, t);
	}

	// ControllerAs is the parsed selector. For example, `app` becomes `app` and
	// `send-message` becomes `sendMessage`
	componentWriter.set('controllerAs', name, t);

	// Finally, pass off the rest of config to the general purpose `decorateDirective`
	// utility
	decorateDirective(config, t);
};
