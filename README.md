# ng-forward

![ng-forward logo](https://raw.githubusercontent.com/ngUpgraders/ng-forward/master/ng-forward-logo.png)

[![Join the chat at https://gitter.im/ngUpgraders/ng-forward](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ngUpgraders/ng-forward?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

***ng-forward*** is the default solution for people who want to start writing code using Angular 2 conventions and styles that runs today on Angular 1.3+.

***ng-forward*** is a collaboration between authors of previous Angular decorator libraries. It's development is assisted and promoted by the Angular team. Ng-forward can be used as part of an upgrade strategy, which may also include [ng-upgrade](http://angularjs.blogspot.com/2015/08/angular-1-and-angular-2-coexistence.html).

We are targeting four types of developers:
- Those who do not know if or when they will upgrade to Angular 2, but they want all the benefits of organizing their code into Components
- Those who are starting Angular 1.x projects today who want the easiest possible upgrade path to Angular 2 and the best Angular 1 code.
- Those who want a production safe way to prepare their Angular 1 projects **now** for the easiest possible upgrade path **later**.
- Those who are actively migrating to Angular 2, who'd like to use ng-forward as the first step in their migration strategy. Once you've used ng-forward to update all the syntax in your project, you can then optionally use [ng-upgrade](http://angularjs.blogspot.com/2015/08/angular-1-and-angular-2-coexistence.html) or go straight to Angular 2.

*Currently in the Alpha phase, please contribute: [ng-forward issues](https://github.com/ngUpgraders/ng-forward/issues)*

*Review the design doc to see our collective ideas: [Google Drive Design Doc](https://docs.google.com/document/d/1oq0T0-jicGzc5uYJc0LE1ZBHm0w1lhVB4IVqUPXWSCg/edit)*

## Getting Started

An ng-forward app is in many ways built like an Angular 2 app. Your app is made up of a tree of components, starting with a single top level component your entire app runs inside. Components can depend on services, which like Angular 2 are plain old ES6 classes. The [official Angular 2 docs](https://angular.io/) are actually a good place to start to familiarize yourself with Angular 2 coding style.

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

> **Behind the Scenes**: We make a call to angular.directive on your behalf. We always set restrict to 'E' (element). The class becomes the directives controller. And we set controllerAs to a camelCased copy of your selector value, e.g. `my-component` becomes `myComponent`.

### Services

Let's take a look at a simple service:

```js
import { Injectable } from 'ng-forward';

@Injectable()
class TestService{
	getValue(){
		return new Promise(resolve => {
			setTimeout(() => resolve('Async FTW!'), 3000);
		});
	}
}
```

Again, it's a regular ES6 class. Just tell the injector that it's injectable with the `@Injectable()` annotation and you can start to inject it into other components and services. Ng-forward will handle the work of wrapping this in an angular service when we bootstrap. If you need to inject dependencies, you can use an Inject decorator, which will cover in a bit.

> **Behind the Scenes**: We make a call to angular.service on your behalf. The class becomes the service singleton instance.

## Digging Deeper
Now lets look at a more complicated component:

```js
import { Component, Inject } from 'ng-forward';

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

> **Behind the Scenes:** The inputs essentially become isolate scope properties. Remember all the '@', '=', and '&'? Kiss those good bye. Each property gets registered several times so it can be used in various ways. Read on...

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

Note there's two ways trigger an event. We can simply trigger a DOM event as seen in `triggerEventNormally`. In this cause the event won't bubble up unless you tell it to.

We can also use the new ng2 Event Emitter syntax, as seen in `triggerEventViaEventEmitter`. This uses the Rxjs Event Emitter to trigger the event.

## Bootstrapping Apps

Let's look at the final building block of the ng-forward app, the top level component we'll use to bootstrap our app.

```js
@Component({
	selector: 'app',
	bindings: [TestService, "ui.router"]
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

> **Behind the Scenes**: the `providers` and `directives` component properties do exactly the same thing in ng-forward. They just tell ng-forward what dependencies to bundle up into your module during the bootstrap (or bundle) call. However, we recommend using directives for directives and providers for services and ng1 modules, as it will make upgrading easier.


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

> **Behind the Scenes:** ng-forward will handle all the work of bundling up your module, translate components to ng 1.x syntax, etc. Then it will look for the selector in your html and call ng1's bootstrap method on it.

Let's look at the completed code:

```js
import 'babel/polyfill';
import 'angular';
import 'zone.js';
import uiRouter from 'angular-ui-router';
import {Component, View, Inject, EventEmitter, bootstrap} from 'ng-forward';

class TestService{
	getValue(){
		return new Promise(resolve => {
			setTimeout(() => resolve('Async FTW!'), 3000);
		});
	}
}

@Component({ selector: 'nested' })
@View({ template: '<h3>Nested</h3>' })
class Nested{ }

@Component({
	selector: 'inner-app',
	properties: ['message1', 'message2', 'msg3: message3'],
	events: ['event1', 'evt2: event2']
})
@View({
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

@Component({
	selector: 'app',
	bindings: [TestService, "ui.router"]
})
@View({
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
3. zone.js: Zone.js is an optional component for ng-forward. However, it gives you an extremely cool feature -- it removes the need for `$scope.$apply` calls (for the most part). If you don't use zone.js, you can inject `$scope` manually and call `$apply` but obviously you'll need to change that code if you convert to Angular 2.x
4. angular-ui-router: totally optional, but closer in syntax to the Angular 2 Router
5. All the elements we need of ng-forward

## FAQ

#### What is the difference between the official Angular upgrade strategy (ng-upgrade) and ng-forward?

From the words of Pete Bacon Darwin (@petebacondarwin), Angular 1 Lead Developer:
> [We suggest] that ng-forward could be used as part of an upgrade strategy, which could also include ng-upgrade. I think the jury is still out on the very best strategy and I expect that there isn't a one size fits all solution.

> [We give] equal sway to the two projects and I think there is value in developers considering both. [There] are a variety of options available, of which ng-forward plays a part; that ng-forward can also be used even whether or not upgrade is your aim, as it can make you ng1 code and development cleaner.

#### I'm using an existing decorator library. What are my options for converting to ng-forward?

Conversion options will depend on the specific library you're using and the author of that library. However, all of the following library's authors were involved in creating ng-forward.

AngularDecorators - @MikeRyan52 (which is also the codebase ng-forward descended from)

A1Atscript - @hannahhoward

Angular2 Now - @pbastowski

NgDecorate - @Mitranim

#### How will ng-forward accomodate changes in the Angular 2.x API?

The Angular 2.x API has changed a lot and is hopefully starting to stabilize. However, obviously there will be more changes before final release.

Our goal in ng-forward will be to adjust to changes but support the old syntax with deprecation warnings.

#### Does ng-forward support all Angular 2.x features?

No. Definitely not. In addition to some of the differences called out above, there are several other features that are simply not possible to implement using Angular 1.x as a base. We'll trying to add what we can over time, but something will just have to wait for Angular 2.x

#### What does a migration from regular Angular 1 code to ng-forward code look like?

Here's an example of the steps you might take:
- [Before Migration](https://gist.github.com/timkindberg/2c9ae631ee1a7428e421)
- [Part 1 A](https://gist.github.com/timkindberg/95166e525685db1f6394) /  [Part 1 B](https://gist.github.com/timkindberg/af2e4f84420dd334e4cd)
- [Part 2 A](https://gist.github.com/timkindberg/78226481690a20f9f2a0) / [Part 2 B](https://gist.github.com/timkindberg/78226481690a20f9f2a0)
- [After Migration](https://gist.github.com/timkindberg/73280001a84a15370ade)

#### Do you support writing in plain ES5?

Our goal is to support the ES5 syntax used by Angular 2.x. Currently, this part of ng-forward is not well developed but we intend to support it in the future.

#### Who made this library?

Core contributors so far are @MikeRyan52, @pbastowski, @Mitranim, @hannahhoward, and @timkindberg
