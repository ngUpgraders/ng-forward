# Ng-Forward Walk-through

Here you'll find an informal walkthrough of ng-forward meant to help you introduce you to various concepts and the overall usage. For an official API reference, [go here](https://github.com/ngUpgraders/ng-forward/blob/master/API.md).

## Install

**NPM**: 
```sh
npm i --save ng-forward@latest reflect-metadata
```

**CDN**: 
```html
<script src="https://npmcdn.com/ng-forward/ng-forward.dist.min.js"></script>
```

## Dependencies

Depends on Angular 1.3+ and reflect-metadata. Ng-forward comes bundled with a bare minimum set of rxjs classes (for EventEmitter) and the babel/polyfill.

```js
import 'angular';
import 'reflect-metadata';
import {bootstrap} from 'ng-forward';
```

## Getting Started

An ng-forward app is in many ways built like an Angular 2 app. Your app is made up of a tree of components, starting with a single top level component your entire app runs inside. Components can depend on services, which like Angular 2 are plain old ES6 classes. The [official Angular 2 docs](https://angular.io/) are actually a good place to start to familiarize yourself with Angular 2 coding style.

**Use a ES6/TS transpiler, here's some suggestions:**
- Babel: [browserify/babelify](https://github.com/babel/babelify) or [webpack/babel-loader](https://github.com/babel/babel-loader)
- Typescript: [browserify/tsify](https://github.com/TypeStrong/tsify) or [webpack/typescript](https://github.com/s-panferov/awesome-typescript-loader)

### Components

The syntax for components in ng-forward mirrors Angular 2 components as much as possible, with a few key differences. Here's a simple component:

```js
import { Component } from 'ng-forward';

@Component({
	selector: 'nested',
	template: '<h3>Nested</h3>'
})
class Nested{ }
```

So far this syntax here is identical to Angular 2. We have a component annotation that specifies this component will apply to any DOM element using the tag 'nested'.

If you've used previous decorator libraries, you'll notice ng-forward doesn't require you to use any calls to @Module, new Module or .Module. ng-forward auto-creates a module for you during bootstrap. If you need create a module to co-exist with other non-ng-forward ng1 modules, you can use (`bundle`)[https://gist.github.com/timkindberg/95166e525685db1f6394] to bundle up your app or portions of your app.

### Services

Let's take a look at a simple service:

```js
import { Injectable, Inject } from 'ng-forward';

@Injectable()
@Inject('$q', '$timeout')
class TestService{
	constructor($q, $timeout) {
		this.$q = $q;
		this.$timeout = $timeout;
	}
	
	getValue(){
		return this.$q(resolve => {
			this.$timeout(() => resolve('Async FTW!'), 3000);
		});
	}
}
```

Again, it's a regular ES6 class. Just tell the injector that it's injectable with the `@Injectable()` annotation and you can start to inject it into other components and services. Ng-forward will handle the work of wrapping this in an angular service when we bootstrap. If you need to inject dependencies, you can use an Inject decorator. Here we are injecting some 'legacy' services—$q and $timeout—so we request them as strings. If we want to inject other es6-class-based servies we can reference those as objects, which will cover in a bit.

## Digging Deeper
Now lets look at a more complicated component:

```js
import { Component, Inject, Input, Output } from 'ng-forward';

@Component({
	selector: 'inner-app'
	directives: [Nested],
	template: `
		<h2>Inner app</h2>
		<p>ES7 async resolved value: {{ innerApp.num || 'resolving...' }}</p>
		<nested></nested>

		<h4>Event</h4>
		<button (click)="innerApp.triggerEventNormally()">
			Trigger DOM Event
		</button>
		<button (click)="innerApp.triggerEventViaEventEmitter()">
			Trigger Emitted Event
		</button>

		<h4>One Way String from Parent (read-only)</h4>
		<p>{{innerApp.msg3}}</p>

		<h4>One Way Binding from Parent (read-only)</h4>
		<input ng-model="innerApp.message1"/>

		<h4>Two Way Binding to/from Parent (read/write)</h4>
		<input ng-model="innerApp.message2"/>
	`
})
@Inject(TestService, '$element')
class InnerApp{
	@Input() message1;
	@Input() message2;
	@Input('message3') msg3;

	@Output() event1 = new EventEmitter();
	@Output('event2') evt2 = new EventEmitter();

	constructor(TestService, $element){
		this.$element = $element;
		this.TestService = TestService;
		this.resolveValue();
		this.evt2 = new EventEmitter();
	}

	async resolveValue(){
		this.num = await this.TestService.getValue();
	}

	triggerEventNormally() {
		this.$element.triggerHandler('event1');
	}

	triggerEventViaEventEmitter() {
		this.evt2.next()
	}
}

```

Wow. There's a lot more going on here, so let's walk throw some key aspects of this code:

### Directives

```js
@Component({
	...
	directives: [Nested],
	template: ...
})
```

Here we're setting view properties of the Component. Note the directives property -- by setting the directives properties, we're telling ng-forward what other directives we'll use in the template. In this case, we're saying we'll reference the Nested component within this template. Under the hood, ng-forward will use this to make sure these directives get into our final angular module. For now, there is no need to specify core directives (e.g. ng-if, ng-show, ng-repeat, etc).

*Angular 2 difference: Because Angular 1.x has no shadow dom, these directives will become active everywhere they're used in a template in the app. One of the features of Angular 2 is the ability to have directives only active inside certain components. Because of the way Angular 1.x's injector works, this is not possible to implement in ng-forward currently.*

### Built-in Events

Let's take a look at the template for this component:

```js
		<h4>Event</h4>
		<button (click)="innerApp.triggerEventNormally()">
			Trigger DOM Event
		</button>
		<button (click)="innerApp.triggerEventViaEventEmitter()">
			Trigger Emitted Event
		</button>
```

ng-forward has built custom directives for all the (standard dom events)[https://github.com/ngUpgraders/ng-forward/blob/master/src/util/events.js#L6-L36]:
click, change, scroll, etc so you can use ng2 syntax for interacting with these events. Here we attach a click handler to a button, which in turn calls a function on a component. This is equivalent to using standard ng-click and works the same way, but matches Angular 2 syntax.

### Inputs
Now let's look at passing inputs to components. In the component class you'll see these lines:

```js
	@Input() message1;
	@Input() message2;
	@Input('message3') msg3;
```

These lines specify what attributes can be passed as properties when we call our InnerApp component. If you don't pass a parameter to Input, the name of the property on the class is the same name you'll use when you call the component. If you pass a parameter, that becomes the name you use when you call this property from a parent component.

Here's a part of the template that makes a simple reference to properties passed from a parent:

```
<h4>One Way String from Parent (read-only)</h4>
<p>{{innerApp.msg3}}</p>

<h4>One Way Binding from Parent (read-only)</h4>
<input ng-model="innerApp.message1"/>

<h4>Two Way Binding to/from Parent (read/write)</h4>
<input ng-model="innerApp.message2"/>
```

Note the references to one or two way binding. In Angular 2, properties by default are one way bound. We use some trickery under the hood in ng-forward to simulate one way binding in Angular 1.x. When we look at the parent component we'll show you how you can override one way binding and make a two way bound data property.

### Inject
So we've seen the template, let's look at a line that's unique to ng-forward now:
```js
@Inject(TestService, '$element')
```

Right here, we're specifying what dependencies we want to inject into the constructor function for our component. The Inject decorator can also be used to inject dependencies into a service. If we're using a service written in ng-forward, we just pass a reference to it. If we need to get a built in Angular 1.x service, or a service from a legacy module, we just pass a string. Here we need `$element`, so we pass that as a string. Components can ask for the same 'locals' that directive controllers can ask for: `$scope, $element, $attrs, and $transclude`, plus any global injectable.

*Angular 2 Difference: In Angular, particularly if you're writing in TypeScript, you don't need Inject at all. We aren't assuming typescript for ng-forward, so right now using types for dependency injection is not supported*

### Outputs

Now let's look at Outputs, an Angular 2 mechanism for triggering custom events that a parent component can attach handlers to:

``` js
	@Output() event1;
	@Output('event2') evt2 = new EventEmitter();
```

and here's where we call them in the component

```js
	triggerEventNormally() {
		this.$element.triggerHandler('event1');
		// or for bubbling of custom events...
		this.$element.nativeElement.dispatchEvent(new CustomEvent('event1', { data, bubbles: true }));
	}

	triggerEventViaEventEmitter() {
		// this won't bubble, but most custom events probably shouldn't...
		this.evt2.next()
	}
```

Note there's two ways to trigger an event. We can simply trigger a DOM event as seen in `triggerEventNormally`. In this case the event won't bubble up unless you tell it to.

We can also use the new ng2 Event Emitter syntax, as seen in `triggerEventViaEventEmitter`. This uses the Rxjs Event Emitter to trigger the event. These events never bubble.

## Bootstrapping Apps

Let's look at the final building block of the ng-forward app, the top level component we'll use to bootstrap our app.

```js
@Component({
	selector: 'app',
	providers: [TestService, "ui.router"]
	directives: [InnerApp, Nested],
	template: `
		<h1>App</h1>
		<nested></nested>
		<p>Trigger count: {{ app.triggers }}</p>

		<h4>One Way Binding to Child:</h4>
		<input ng-model="app.message1"/>

		<h4>Two Way Binding to/from Child:</h4>
		<input ng-model="app.message2"/>

		<hr/>

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

bootstrap(AppCtrl);
```

There are a few extra elements we need to look at here that ng-forward uses to bootstrap our app.

### Providers

```js
	providers: [TestService, "ui.router"]
```

Providers are used to specify what services are injectable in our app. They're the closest thing ng-forward has to angular.module from 1.x. If you need to use a legacy module, you'll pass it here as a string. Otherwise, just pass the services your component will need.

*Angular 2 difference: You might be wondering why you'd pass TestService as a provider here, and then still have to inject it in the innerApp component. In Angular 2, providers is actually a way to specify what services are available inside the component in a hierarchical fashion. In ng-forward, any services you pass to providers on any component will be available to inject on any other component, because the Angular 1.x injector doesn't support this hierarchy. You should still try to limit cross usage to prevent pain during upgrade.*

*Tip: Use strings in the `@Inject` decorator to specify legacy services, e.g. '$q'. Use strings in `providers` or `directives` to specify legacy modules, e.g. 'ui.router'*

### Calling Child Components

Once again we'll setup directives we need for our template. Remember this serves two purposes, it matches the Angular 2 syntax, and it tells ng-forward to bundle these items into our module.

```js
directives: [InnerApp, Nested]
```

Let's look at how we call the InnerApp component

```js
		<h4>One Way Binding to Child:</h4>
		<input ng-model="app.message1"/>

		<h4>Two Way Binding to/from Child:</h4>
		<input ng-model="app.message2"/>

		<hr/>

		<inner-app (event1)="app.onIncrement()" (event2)="app.onIncrement()"
		           [message1]="app.message1" [(message2)]="app.message2" message3="Hey, inner app... nothin'">
		</inner-app>
```

Here we see various bindings and events in use. We are listening for the event1 and event2 events on inner-app. You use parenthesis to bind to events. With message 1, 2 and 3, we show the three ways you can bind to component properties: prop (with no prefix) will pass in a simple string, [prop] will one-way bind to an expression, and [(prop)] will two way bind to an expression.

### Bootstrapping

```js
bootstrap(AppCtrl);
```

This is the final step to setting up an ng-forward app.

Let's look at the completed code ([Here's a plunkr of this code](http://plnkr.co/edit/ktxXKHyHQ5DLcixe6kpO?p=preview)):

```js
import 'babel/polyfill';
import 'angular';
import uiRouter from 'angular-ui-router';
import {Component, Injectable, Input, Output, Inject, EventEmitter, bootstrap} from 'ng-forward';

@Injectable()
@Inject('$q', '$timeout')
class TestService{
	constructor($q, $timeout) {
		this.$q = $q;
		this.$timeout = $timeout;
	}
	
	getValue(){
		return this.$q(resolve => {
			this.$timeout(() => resolve('Async FTW!'), 3000);
		});
	}
}

@Component({ selector: 'nested' })
@View({ template: '<h3>Nested</h3>' })
class Nested{ }

@Component({
	selector: 'inner-app',
	directives: [Nested],
	template: `
		<h2>Inner app</h2>
		<p>ES7 async resolved value: {{ innerApp.num || 'resolving...' }}</p>
		<nested></nested>

		<h4>Event</h4>
		<button (click)="innerApp.triggerEventNormally()">
			Trigger DOM Event
		</button>
		<button (click)="innerApp.triggerEventViaEventEmitter()">
			Trigger Emitted Event
		</button>

		<h4>One Way String from Parent (read-only)</h4>
		<p>{{innerApp.msg3}}</p>

		<h4>One Way Binding from Parent (read-only)</h4>
		<input ng-model="innerApp.message1"/>

		<h4>Two Way Binding to/from Parent (read/write)</h4>
		<input ng-model="innerApp.message2"/>
	`
})
@Inject(TestService, '$element')
class InnerApp{
	@Input() message1;
	@Input() message2;
	@Input('message3') msg3;

	@Output() event1 = new EventEmitter();
	@Output('event2') evt2 = new EventEmitter();
	
	constructor(TestService, $element){
		this.$element = $element;
		this.TestService = TestService;
		this.resolveValue();
		this.evt2 = new EventEmitter();
	}
 	
 	// this will only work in babel, not typescript
	async resolveValue(){
		this.num = await this.TestService.getValue();
	}

	triggerEventNormally() {
		this.$element.triggerHandler('event1');
	}

	triggerEventViaEventEmitter() {
		this.evt2.next()
	}
}

@Component({
	selector: 'app',
	providers: [TestService, "ui.router"],
	directives: [InnerApp, Nested],
	template: `
		<h1>App</h1>
		<nested></nested>
		<p>Trigger count: {{ app.triggers }}</p>

		<h4>One Way Binding to Child:</h4>
		<input ng-model="app.message1"/>

		<h4>Two Way Binding to/from Child:</h4>
		<input ng-model="app.message2"/>

		<hr/>
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

bootstrap(AppCtrl);

```

Note some imports at the top of the file:

1. babel/polyfill: Right now Babel.js is the preferred transpiler for ng-forward. We'll be looking at Typescript soon.
2. angular: Good ol' version 1
3. angular-ui-router: totally optional, but closer in syntax to the Angular 2 Router
4. All the elements we need of ng-forward
