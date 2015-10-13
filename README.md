# ng-forward

[![Join the chat at https://gitter.im/ngUpgraders/ng-forward](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ngUpgraders/ng-forward?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The default solution for those that want to write Angular 2.x style code in Angular 1.x

*Currently in the Alpha phase, please contribute: [ng-forward issues](https://github.com/ngUpgraders/ng-forward/issues)*

*Review the design doc to see our collective ideas: [Google Drive Design Doc](https://docs.google.com/document/d/1oq0T0-jicGzc5uYJc0LE1ZBHm0w1lhVB4IVqUPXWSCg/edit)*


Example:

```js
import 'babel/polyfill';
import 'angular';
import 'zone.js';
import uiRouter from 'angular-ui-router';
import {Component, View, Inject, EventEmitter, bootstrap} from 'ng-forward';

// In ng-forward you don't need to use a single decorator if you are creating a
// service and you don't need any injectables. This class has zero annotations. 
// It's a regular es6 class. We wrap this in a service for you during bootstrap.
class TestService{
	getValue(){
		return new Promise(resolve => {
			setTimeout(() => resolve('Async FTW!'), 3000);
		});
	}
}

// A super simple component. Notice ng-forward doesn't require you to use any calls
// to @Module, new Module or .Module like previous decorator libraries. We auto
// create a module for you during bootstrap.
@Component({ selector: 'nested' })
@View({ template: '<h3>Nested</h3>' })
class Nested{ }

// A component where we'll showcase properties and events. Declare your properties
// and events as arrays just like Angular 2. You can rename an event locally by
// using the syntax 'localName: attrName'. If you just specify a single string
// 'name' then it is used for both the local name and attr name.
@Component({
	selector: 'inner-app',
	properties: ['message1', 'message2', 'msg3: message3'],
	events: ['event1', 'evt2: event2']
})
// Set the view of the Component. Add the directives you'll be using to the
// 'directives' array. For now, there is no need to specify core directives
// (e.g. ng-if, ng-show, ng-repeat, etc).
@View({
	directives: [Nested],
	template: `
		<h2>Inner app</h2>
		<p>ES7 async resolved value: {{ innerApp.num || 'resolving...' }}</p>
		<nested></nested>

		<h4>Event</h4>
		<!-- We've created custom directives for all the standard dom events:
		     click, change, scroll, etc. So you can use on-click instead of ng-click
		     to match Angular 2 syntax -->
		<button (click)="innerApp.triggerEventNormally()">
			Trigger DOM Event
		</button>
		<button (click)="innerApp.triggerEventViaEventEmitter()">
			Trigger Emitted Event
		</button>

		<!-- A string value coming from the parent... basic stuff. -->
		<h4>One Way String from Parent (read-only)</h4>
		<p>{{innerApp.msg3}}</p>

		<!-- In Angular 2, one way bindings are the default. We used some trickery
		     to simulate one way data flow from the parent of this directive to this
		     child. If this component tries to change 'message1' it will be
		     unsuccessful, just like our Angular 2 forefathers wanted it to be. -->
		<h4>One Way Binding from Parent (read-only)</h4>
		<input ng-model="innerApp.message1"/>

		<!-- If you truly need your precious two-way binding, here ya go. See how
		     the parent binds to message2. -->
		<h4>Two Way Binding to/from Parent (read/write)</h4>
		<input ng-model="innerApp.message2"/>
	`
})
// Here we inject some elements into the constructor, notice how we inject our
// completely undecorated Test class. Because it's been auto-assigned a service
// behind the scenes, we are able to inject it just fine. Also we'll inject
// a reference the $element with a string. This is still very ng1, but it suffices.
@Inject(TestService, '$element')
class InnerApp{
	constructor(TestService, $element){
		this.$element = $element;
		this.TestService = TestService;
		this.resolveValue();

		// If you register an event in the 'events' array in @Component, and that
		// event is an instance of EventEmitter, then ng-forward sees that and allows
		// you to broadcast that event as an observable with .next(). See our
		// EventEmitter class for more api info.
		this.evt2 = new EventEmitter();
	}

	// Not anything to do with ng-forward... but super cool async / await. Amiright?
	async resolveValue(){
		this.num = await this.TestService.getValue();
	}

	// Example of how to trigger a non-EventEmitter event. It's just a dom event.
	// These only bubble if you tell them to.
	triggerEventNormally() {
		this.$element.triggerHandler('event1');
	}

	// Example of how to trigger an EventEmitter event. These will bubble by default.
	triggerEventViaEventEmitter() {
		this.evt2.next()
	}
}


// Our root component which we will bootstrap below. Again no module management
// needed. Here we specify the non-directive injectables we want to provide for
// injection in the 'bindings' array in @Component. Notice we are passing in
// "ui.router" as a string; ng-forward recognizes this as a module and bundles
// it with this component. All of ui-router's injectables are now available to
// inject into controllers or use in your templates.
@Component({
	selector: 'app',
	bindings: [TestService, "ui.router"]
})
@View({
	// Again specifying directives to use. We really wanted to support specifying
	// dependencies as Objects and not strings wherever possible. So we just pass
	// in the InnerApp and Nested class references.
	directives: [InnerApp, Nested],
	template: `
		<h1>App</h1>
		<nested></nested>
		<p>Trigger count: {{ app.triggers }}</p>

		<!-- You still have to use non-event ng1 directives, such as ng-model
		     used here. -->
		<h4>One Way Binding to Child:</h4>
		<input ng-model="app.message1"/>

		<h4>Two Way Binding to/from Child:</h4>
		<input ng-model="app.message2"/>

		<hr/>

		<!-- Here we see various bindings and events in use. We are listening for
		     the event1 and event2 events on inner-app. You have to prepend with
		     'on-' for events. With message 1, 2 and 3, we show the three ways you
		     can bind to component properties: prop (with no prefix) will pass in
		     a simple string, bind-prop will one-way bind to an expression, and
		     bind-on-prop will two way bind to an expression. -->
		<inner-app (event1)="app.onIncrement()" (event2)="app.onIncrement()"
		           [message1]="app.message1" [(message2)]="app.message2" message3="Hey, inner app... nothin'">
		</inner-app>
	`
})
class AppCtrl{
	constructor(){
		this.triggers = 0;
		this.message1 = 'Hey, inner app, you can not change this';
		this.message2 = 'Hey, inner app, change me';
	}

	onIncrement(){
		this.triggers++;
	}
}

// Finally go ahead and bootstrap a component. It will look for the selector
// in your html and call ng1's bootstrap method on it. What's cool is if you
// include zone.js in your app, we'll automatically bootstrap your app within
// the context of a zone so you don't need to call $scope.$apply (Mike is
// this really true??).
bootstrap(AppCtrl);

```
