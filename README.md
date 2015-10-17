# ng-forward

[![Join the chat at https://gitter.im/ngUpgraders/ng-forward](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ngUpgraders/ng-forward?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

***ng-forward*** is  default solution for people who want to start writing code using Angular 2.x conventions and styles that runs today on Angular 1.x.

***ng-forward*** is a collaboration between several authors of previous Angular decorator libraries, and while it is not the official upgrade path for Angular 1.x to 2.x (see [ng-upgrade](http://angularjs.blogspot.com/2015/08/angular-1-and-angular-2-coexistence.html)), it's development was assisted and promoted by the Angular team. The target audience is primarily people who want to learn Angular 2 coding conventions, and people who are starting Angular 1.x projects today who want an eventual easy upgrade path to Angular 2.x.


*Currently in the Alpha phase, please contribute: [ng-forward issues](https://github.com/ngUpgraders/ng-forward/issues)*

*Review the design doc to see our collective ideas: [Google Drive Design Doc](https://docs.google.com/document/d/1oq0T0-jicGzc5uYJc0LE1ZBHm0w1lhVB4IVqUPXWSCg/edit)*

## Getting Started

An ng-forward app is in many ways built like an Angular 2 app. Your app is made up of a tree of components, starting with a single top level component your entire app runs in side. Components can depend on services, which like Angular are plain old ES6 classes. The [official Angular 2 docs](https://angular.io/) are actually a good place to start to familiarize yourself with Angular 2 coding style. 

### Components

The syntax for components in ng-forward mirrors Angular 2 components as much as possible, with a few key differences. Here's a simple component:

```js
@Component({ selector: 'nested' })
@View({ template: '<h3>Nested</h3>' })
class Nested{ }
```

So far this syntax here is identical to Angular 2. We have a component annotation that specifies this component will apply to any DOM element using the tag 'nested'.

If you've used previous decorator libraries, you'll notice ng-forward doesn't require you to use any calls to @Module, new Module or .Module. ng-forward auto-creates a module for you during bootstrap.

### Services

Let's take a look at a simple service:

```js
class TestService{
	getValue(){
		return new Promise(resolve => {
			setTimeout(() => resolve('Async FTW!'), 3000);
		});
	}
}
```

Whoa! What happened to all the Angular? In ng-forward you don't need to use a single decorator if you are creating a service and you don't need to inject any dependencies. It's a regular ES6 class. Ng-forward will handle the work of wrapping this in an angular service when we bootstrap. If you need to inject dependencies, you can use an Inject decorator, which will cover in a bit.

## Digging Deeper
No lets look at a more complicated component:

```js
@Component({
	selector: 'inner-app'
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
@View({
	directives: [Nested],
	template: ...
})
```

Here we're setting the view of the Component. Note the directives property -- by setting the directives properties, we're telling ng-forward what other directives we'll use in the template. In this case, we're saying we'll reference the Nested component within this template. Under the hood, ng-forward will use this to make sure these directives get into our final angular module. For now, there is no need to specify core directives (e.g. ng-if, ng-show, ng-repeat, etc).

*Angular 2.x difference: Because Angular 1.x has no shadow dom, these directives will become active everywhere they're used in a template in the app. One of the features of Angular 2 is the ability to have directives only active inside certain components. Because of the way Angular 1.x's injector works, this is not possible to implement in ng-forward currently*

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

ng-forward has built custom directives for all the standard dom events:
click, change, scroll, etc so you can use ng2 syntax for interacting with these events. Here we attach a click handler to a button, which in turn calls a function on a component. This is equivalent to using standard ng-click and works the same way.

### Inputs
 
Now let's look at passing inputs to components. In the component class you'll see these lines:

```js
	@Input() message1;
	@Input() message2;
	@Input('message3') msg3;
```

These lines specify what attributes can be passed as properties when we call our InnerApp component. If you don't pass a parameter to Input, the name of the property on the class is the same name you'll use when you call the component. If you pass a parameter, that becomes the name you use in when you call this comment from a parent component.

Here's a part of the template that makes a simple reference to a properties passed from a parent:

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

Right here, we're specifying what dependencies we want to inject into the constructor function for our component. The Inject decorator can also be used to inject dependencies into a service. If we're using a service written in ng-forward, we just pass a reference to it. If we need to get a built in Angular 1.x service, or a service from a legacy module, we just pass a string. Here we need `$element`, so we pass that as a string.

*Angular 2 Difference: In Angular, particularly if you're writing in TypeScript, you don't need Inject at all. We aren't assuming typescript for ng-forward, so right now using types for dependency injection is not supported*

### Outputs

Now let's look at Outputs, an Angular 2 mechanism for triggering custom events that a parent component can attach handlers to:

``` js
	@Output() event1 = new EventEmitter();
	@Output('event2') evt2 = new EventEmitter();
```

and here's where we call them in the component

```js
	triggerEventNormally() {
		this.$element.triggerHandler('event1');
	}

	triggerEventViaEventEmitter() {
		this.evt2.next()
	}
```

Note there's two ways trigger an event. We can simply trigger a DOM event as seen in `triggerEventNormally`. In this cause the event won't bubble up unless you tell it to.

We can also use the new ng2 Event Emitter syntax, as seen in `triggerEventViaEventEmitter` which will cause the event to bubble by default

## Bootstrapping Apps

Let's look at the final building block of the ng-forward app, the top level component we'll use to bootstrap our app.

```js
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

There are a few extra elements we need to look at here that ng-forward uses to bootstrap our app.

### Bindings

```js
	bindings: [TestService, "ui.router"]
```

Bindings are used to specify what services are injectable in our app. They're the closest thing ng-forward has to angular.module from 1.x. If you need to use a legacy module, you'll pass it here as a string. Otherwise, just pass the services your component will need.

*Angular 2 difference: You might be wondering why you'd pass TestService as a binding here, and then still have to inject it in the innerApp component. In Angular 2, bindings is actually a way to specify what services are available inside the component in a hierarchical fashion. In ng-forward, any services you pass to bindings on any component will be available to inject on any other component, because the Angular 1.x injector doesn't support this hierarchy*

*Tip: Use strings in Inject decorators to specify legacy services. Use strings in bindings to specify legacy modules*


### Calling Child Components

Once again we'll setup directives we need for our template

```js
directives: [InnerApp, Nested]
```

Once again, we're specifying what directives we use in our component. You might ask why we put Nested here since we don't actually call in directly. In ng-forward, this isn't actually neccesary. However, in Angular 2.x, any directives you don't specify here won't be available anywhere inside the component template, including if you call them in child components. To keep our code Angular 2.x compatible, we'll specify both directives here, even ng-forward would work fine without Nested.

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
     
Here we see various bindings and events in use. We are listening forthe event1 and event2 events on inner-app. You use parenthesis to bind to events. With message 1, 2 and 3, we show the three ways you can bind to component properties: prop (with no prefix) will pass in a simple string, [prop] will one-way bind to an expression, and [(prop)] will two way bind to an expression.

### Bootstrapping

```js
bootstrap(AppCtrl);
```

This is the final step to setting up an ng-forward app. It will look for the selector in your html and call ng1's bootstrap method on it. Behind the scenes, ng-forward will handle all the work of setting up your modules, translate components to ng 1.x syntax, etc.

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
1. babel/polyfill (right now Babel.js is the preferred transpiler for ng-forward. We'll be looking at Typescript soon)
2. angular
3. zone.js -- Zone.js is an optional component for ng-forward. However, it gives you an extremely cool feature -- it removes the need for `$scope.$apply` calls (for the most part). If you don't use zone.js, you can inject `$scope` manually and call `$apply` but obviously you'll need to change that code if you convert to Angular 2.x
4. angular-ui-router
5. All the elements we need of ng-forward

## FAQ

#### What is the difference between the official Angular upgrade strategy (ng-upgrade) and ng-forward?

The official Angular upgrade is primarily aimed at upgrading existing complete applications to Angular 2.x

Ng-forward is primarily a teaching tool for people to understand Angular 2.x syntax, and also for people who are starting apps either right now or the near future, who don't want to use Angular 2.x till it's production ready, but want upgrading to be very simple.

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

#### Do you support writing in plain ES5?

Our goal is to support the ES5 syntax used by Angular 2.x. Currently, this part of ng-forward is not well developed but we intend to support it in the future.

#### Who made this library?

Core contributors so far are @MikeRyan52, @pbastowski, @Mitranim, @hannahhoward, and @timkindberg
