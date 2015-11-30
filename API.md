# API Reference

#### Table of Contents

Methods:
- [bootstrap](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bootstrap)
- [bundle](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bundle)
- [provide](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#provide)

Decorators:
- [@Component](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component)
- [@Directive](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#directive)
- [@Input](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#input)
- [@Output](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#output)
- [@Injectable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable)
- [@Inject](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#inject)
- [@Pipe](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#pipe)
- [@StateConfig](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#stateconfig)
- [@Resolve](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#resolve)

Testing:
- [TestComponentBuilder](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#testcomponentbuilder)
- [ComponentFixture](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#componentfixture)

Other:
- [The Dependency Tree](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#the-dependency-tree)
- [EventEmitter](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#eventemitter)
- [JQLite Extensions](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#jqlite-extensions)

## bootstrap

Used to bootstrap your ng-forward application. Pass it your entry point component and it'll [bundle](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bundle) up your app and then bootstrap it. Do **not** use the `ng-app` directive.

Example:

```js
import { bootstrap, Component } from 'ng-forward';

@Component({ selector: 'app', template: 'Hello World!' })
class App { }

bootstrap(App);
```

###### Parameters

- **`component`**  **class**  Any class that has been decorated with [`@Component`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component).
- **`otherProviders`**  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  An array of other providers that you want to include in the bundle.

Returns the `injector` from the bootstrapped auto-bundled module.

###### Behind the Scenes

[`bundle`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bundle) is called to auto-create an angular module and then `angular.bootstrap` is called on the page element that matches the component's selector.

## bundle

Used to create (aka 'bundle up') an angular 1 module by tracing the provider tree of an entry point provider. Ng-Forward doesn't create an angular module until bundle or bootstrap is called. This differs from typical angular 1 where a module is usually created and then appended to with services and directives.

Example:

```js
import { bundle, Component } from 'ng-forward';

@Component({ selector: 'app', template: 'Hello World!', 
    providers: [...otherProvidersToIncludeInTheBundle],
    directives: [...otherDirectivesToIncludeInTheBundle]
})
class App { }

export bundle(App); // Will export the bundled angular 1 module
```

###### Parameters

- **`moduleName`** **string** The name of the module to be created
- **`provider`** **class** The entry point provider whose dependencies (providers, directives) will be traced and bundled.
- **`otherProviders`**  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  An array of other providers that you want to include in the bundle.

Returns a [`DecoratedModule`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#decoratedmodule).

###### Behind The Scenes

`angular.module` is called. All string-based providers are considered ng 1 modules and passed as deps to `angular.module`. All other providers are added as whatever is appropriate: [`@Component`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component) calls `module.directive`, [`@Pipe`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#pipe) calls `module.filter`, [`@Injectable`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable) calls `module.service`, etc.

#### The Dependency Tree

**Important! - please read**

It's important that you tell us what dependencies your component relies on and what it needs to be bundled up with it. This allows us to trace all the dependencies in your application and do our fancy just-in-time angular module creation. If you've left out a dependency it will not be included in the module.

There are various ways to specify dependencies:

```js
// Your component relies on another component? Add it to 'directives'.
@Component()
class MyOtherComponent {}

@Component({
  selector: 'my-component',
  directives: [MyOtherComponent],
  template: '<my-other-component></my-other-component>'
})
class MyComponent {}

// Your component relies on a directive? Add it to 'directives'.
@Directive()
class MyDirective {}

@Component({
  selector: 'my-component',
  directives: [MyDirective],
  template: '<div my-directive></div>'
})
class MyComponent {}

// Your component relies on a pipe? Add it to 'pipes'.
@Pipe()
class MyPipe {}

@Component({
  selector: 'my-component',
  pipes: [MyPipe],
  template: '<div>{{ ctrl.foo | myPipe }}</div>'
})
class MyComponent {}

// Your component relies on a service? Add it to 'providers' and/or @Inject it.
@Injectable()
class MyOtherService {}

@Component({
  selector: 'my-component',
  providers: [MyOtherService]
})
@Inject(MyOtherService)
class MyComponent {}

// Your component relies on an ng1 service? @Inject it as a string.
@Component()
@Inject('$http')
class MyComponent {
    constructor($http) {}
}

// Your component relies on an ng1 module? Add it to 'providers' as a string.
@Component({
  selector: 'my-component',
  providers: ['ui.router']
})
class MyComponent {}

// Your service relies on another service? Just @Inject it.
@Injectable()
class MyOtherService {}

@Injectable()
@Inject(MyOtherService)
class MyService {}
```

## @Component

A decorator for adding component metadata to a class. Components are essentially angular 1 directives with both a template and controller. If you are looking to only modify the host element in some way, you should use [@Directive](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#directive).

Example:

```js
import { Component } from 'ng-forward';

@Component({ 
    selector: 'app', 
    template: `Hello {{app.place}}!`,
    providers: [...providers],
    directives: [...directives]
    pipes: [...pipes]
})
class App { 
    constructor() {
        this.place = "World";
    }
}
```

###### Parameters

- **`selector`**  **string**  The component's selector. It must be a css tag selector, for example `'app'` or `'my-thing'` are **valid**, but `'[my-attr]'` or `'.my-class'` are **invalid**.
- **`template`**  **[string]**  The template string for the component. You can bind to class instance properties by prepending your bindings with the selector in camel-case form, e.g. `<h1>My Component's Name is: {{myComponent.name}}</h1>`.
- **`templateUrl`**  **[string]**  Path to an external html template file. Either `template` or `templateUrl` **must** be provided.
- **`providers`**  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Any providers that this component or any of it's children depends on.
- **`directives`**  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Any directives or components that this component or any of it's children depends on.
- **`pipes`**  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Any [pipes](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#pipe) that this component or any of it's children depends on.
- **`inputs`**  **[Array&lt;string&gt;]**  An array of strings naming what class properties you want to expose in `bindToController` (or `scope` if angular 1.3). For example, `inputs: ['foo']` will connect the class property `foo` to the input `foo`. You can also rename the input, for example `inputs: ['foo:theFoo']` will connect the class property `foo` to the input `the-foo`.
- **`outputs`**  **[Array&lt;string&gt;]**  An array of strings naming what class properties you want to expose as outputs. For example, `outputs: ['fooChange']` will notify the app that this component can fire a `'fooChange'` event. If there is a class property `fooChange` that is an `EventEmitter` it can trigger this event via `this.fooChange.next()`. Otherwise the event can also be triggered with a regular DOM event of name `'fooChange'`. You can also rename the output, for example `inputs: ['fooChange:theFooChange']` will notify of a 'theFooChange' event, but will still look for a `fooChange` property on the class.
- **`controllerAs`**  **[string=selector camel-cased]**  The controller name used in the template.

###### Inputs and Outputs

Inputs and Outputs are the public API of a component. There are two ways to specify them.
- The `inputs` and `outputs` config property on @Component
- The [@Input](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#input) and [@Output](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#output) decorators

If you had a component `MenuDropdown` like so:

```js
@Component({ 
    selector: 'menu-dropdown', 
    template: `
    <label>{{menuDropdown.name}}</label>
    <a ng-repeat="option in menDropdown.options" ng-href="{{option.action}}">{{option.name}}</a>
    `,
    inputs: ['options'],
    outputs: ['optionSelect']
})
class MenuDropdown {
    // Or you can use decorators instead of the properties above
    @Input() options;
    @Output() optionSelect = new EventEmitter;
}
```

Then I could use that component in another component's template like so, passing in 'inputs' and listening for 'outputs'.

```html
@Component({
    selector: 'main-menu',
    template: `
    <div ng-repeat="menu in mainMenu.menus">
        <menu [options]="menu.options" (option-select)="menu.optionSelected($event)"></menu>
    </div>
    `
})
class MainMenu {}
```

Every input can be bound in three different ways, just like Angular 2: 

- String-based `foo="some string"`. Will pass the raw string into the input.
- One-way binding `[foo]="someObj.property"`. Will one-way bind the expression to the input. The input can be changed locally but if the expression ever changes it will overwrite the input with the latest value.
- Two-way binding `[(foo)]="someObj.property"`. Will two-way bind the expression to the input. If either the input or expression changes, the other will change to match.

Every output can trigger it's event in various ways.

- Via [EventEmitter](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#eventemitter). This is the preferred method. Does not bubble. Add a matching named event emitter to your class and call it's `.next()` method.

```js
import { Component, EventEmitter } from 'ng-forward';

@Component({ ... })
@Inject('$element')
class MenuDropdown {
    // Initialize your output as an EventEmitter and now you can trigger with .next()
    optionSelect = new EventEmitter();
    
    triggerEventViaEventEmitter() {
        this.optionSelect.next(selectedOption)
    }
}
```

- Via DOM Event. Bubbling is configurable.

```js
import { Component, EventEmitter } from 'ng-forward';

@Component({ ... })
@Inject('$element')
class MenuDropdown {    
    constructor($element) {
        // Need a reference to the host element for DOM event triggering
        this.$element = $element;
    }
    
    triggerEventViaDOM() {
        this.$element.triggerHandler('optionSelect');
        // or for bubbling of custom events...
        this.$element.nativeElement.dispatchEvent(new CustomEvent('optionSelect', { data, bubbles: true }));
    }
}
```

###### Transclusion
 
Transclusion is always enabled. Just add `<ng-content></ng-content>` (converted to ng-transclude) or `<ng-transclude></ng-tranclude>` to mark your transclusion point. No real reason to set this to false. We always set it to `true`. You can tranclude by default. 

###### Behind the Scenes 

At [bootstrap](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bootstrap) time, a call to `angular.directive` is made. Angular 1 directive properties are set as follows:

- `template` is set via the @Component config template property (`templateUrl` can also be used)
- `controller` is set to the class instance, but it not instantiated until after the link phase so that child directives are available in the DOM. `$scope`, `$element`, `$attrs`, and `$transclude` are injectable as locals.
- `restrict` is set to 'E' since components must use tag-based selectors.
- `controllerAs` is set to a camel-cased version of the selector but can be overridden if you prefer 'vm' or something else.
- `scope` and `bindToController`:
    - If angular 1.3, inputs are set on an isolated `scope` and `bindToController` to `true`.
    - If angular 1.4+, `scope` is set to an isolate scope with `{}` and inputs are set on `bindToController` object.
- `transclude` is always set to `true`
- `link` and `compile` are not set but you can optionally set them if needed via the decorator.
- For each output we create a directive of `'(outputName)'` that is listening for a DOM event or rx event of the same name.
- Ng-forward does not differentiate between the `providers`, `directives` or `pipes` config properties; they're all used to define dependencies for the bundle. However in Angular 2 their unique usage matters, so you should use the properties properly to ease migration to Angular 2.

## @Directive

A decorator for adding directive metadata to a class. Directives differ from Components in that they don't have templates; they only modify the host element.

Example:

```js
import { Directive } from 'ng-forward';

@Directive({ 
    selector: '[foo-class]', 
    providers: [...providers],
})
@Inject('$element')
class FooClass { 
    constructor($element) {
        $element.addClass('foo');
    }
}
```

###### Parameters

- **`selector`**  **string**  The component's selector. It must be a css attribute selector, for example `'[my-thing]'` is **valid**, but `'my-component'` or `'.my-class'` are **invalid**.
- **`providers`**  **[Array&lt;IProvidable&gt;]**  Any providers that this component or any of it's children depends on.

###### Behind the Scenes 

At [bootstrap](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bootstrap) time, a call to `angular.directive` is made. Angular 1 directive properties are set as follows:

- `template` is not set.
- `controller` is set to the class instance, but it not instantiated until after the link phase so that child directives are available in the DOM. `$scope`, `$element`, `$attrs`, and `$transclude` are injectable as locals.
- `restrict` is set to 'A' since directives must use attribute-based selectors.
- `controllerAs` is set to a camel-cased version of the selector but can be overridden if you prefer 'vm' or something else.
- `scope` is not set and so is not isolated.
- `link` and `compile` are not set and are not able to be set.

## @Input

An alternative to using the `inputs` property on [@Component](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component).

Example:

```js
@Component({ ... })
class MenuDropdown {
    @Input() options;
}
```

###### Parameters

- **`exposedName`**  **[string]**  If provided, then it will be the name of the input when setting on the html element.

## @Output

An alternative to using the `outputs` property on [@Component](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component). Example: `@Input('fooPublic') fooLocal;`.

Example:

```js
@Component({ ... })
class MenuDropdown {
    @Output() optionSelect = new EventEmitter();

    someMethod() {
        this.optionSelect.next('payload');
    }
}
```

###### Parameters

- **`exposedName`**  **[string]**  If provided, then it will be the name of the output when listening on the html element. Example: `@Output('fooChangePublic') fooChangeLocal;`.

## EventEmitter

Extends RxJS [Subject](https://github.com/ReactiveX/RxJS/blob/master/src/Subject.ts). Really we have this specifically for [Outputs](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#output) but could be used for your own general purpose event emitter as well.

#### subscribe(generatorOrNext?: any, error?: any, complete?: any): any

We use this method behind the scenes to subscribe to your output events. You most likely will not use this method.

###### Parameters

- **`generatorOrNext`**  **Object | Function**  If **Function**, then it's a callback that is called everytime the Subject triggers 'next'.
- **`generatorOrNext.next`**  **[Function]**  Callback that is called everytime the Subject triggers 'next'.
- **`generatorOrNext.error`**  **[Function]**  Callback that is called when the Subject has an 'error'.
- **`generatorOrNext.complete`**  **[Function]**  Callback that is called when the Subject is 'completed'.
- **`error`**  **[Function]**  Callback that is called when the Subject has an 'error'.
- **`complete`**  **[Function]**  Callback that is called when the Subject is 'completed'.

#### next(value: any)

Will trigger all subscriber's next callbacks, passing along the value. This is the main way to trigger an EventEmitter-based output.

###### Parameters

- **`value`**  **[any]**  A value to pass along to the next callback of any event subscribers.

## JQLite Extensions

Ng-Forward adds the following extensions to the JQLite / JQuery object returned by angular.element. These extensions mimic features found in Angular 2. These extensions serve as helpful methods for your convenience. All of these methods work on the 0 index element if the jq collection has more than one element.

#### nativeElement

**read-only** The native DOM element inside the jq wrapper. 

#### componentInstance

**read-only** The component's class instance.

#### componentViewChildren

**read-only** An array of all child elements wrapped as jq elements.

#### getLocal(injectable)

An easy way to ask the injector for a dependency. You can pass either string or annotated class.

###### Parameters

- **`injectable`**  **string | class**  The string or annotated class you'd like to retrieve from the injector.

## @Injectable

A decorator that marks a class as injectable. It can then be injected into other annotated classes via the [@Inject](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#inject) decorator.

Example:

```js
import { Injectable, Inject } from 'ng-forward';

@Injectable()
class MyService {
    getData() {}
}

@Injectable()
@Inject(MyService)
class MyOtherService {
    constructor(myService) {
        this.data = myService.getData();
    }
}
```

###### Behind the Scenes
 
At bootstrap time, a call to `module.service` is made. The service name is auto-generated as you should not need to access manually. If you must access it, use the [getInjectableName()](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#getinjectablename) utility method.

## @Inject

A decorator that declares the dependencies to be injected in to the class' constructor.

Example:
```js
import { Component, Inject } from 'ng-forward';
import { MyService } from './my-service.js';

@Component()
@Inject('$q', '$element', MyService)
class MyOtherService {
    constructor($q, $element, myService) { }
}
```

###### Parameters

- **`injectables`**  **string | class**  One or more injectables. Can be of type **string** or **class**.
    - If **string**, then it's considered a core angular service such as $q or $http. It could also be a special 'local', for example component's can inject $element, $attrs or $scope.
    - If **class**, then it's considered to be an annotated class that is injectable, for example via the [@Injectable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable) decorator.

###### Behind the Scenes

The injectables are added to the `$inject` property of the class constructor function.

## provide

Creates a new provider to be bundled with your application and available for injection. This can be used in similar fashion to `module.value`, `module.constant`, `module.factory`, `module.service` and also to overwrite existing dependecies during testing.

Example:

```js
import { Component, provide } from 'ng-forward';

const MY_CONSTANT = new OpaqueToken('myConstant');

class MyClass {}
class MyOtherClass {}

@Injectable()
class MyService {
    getData() {}
}

@Component({
    selector: 'app',
    template: '...',
    providers: [
        provide('myValue',  { useValue: 100 }),
        provide(MY_CONSTANT,{ useConstant: 0 }),
        provide(MyClass,    { useClass: MyOtherClass }),
        provide(MyData,     { useFactory: myService => myService.getData(), deps: [MyService] })
    ]
})
@Inject('configVal')
class App {
    constructor(configVal) {
        this.configVal = configVal;
    }
}
```

###### Parameters

- **`token`**  **string | class | [OpaqueToken](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#opaquetoken)**  A token that will be used when asking for the dependency. Whatever you use, string, class or OpaqueToken, you must use that same object when injecting the dependency with [@Inject](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#inject). If you pass a class, it does not need to be already annotated since it's simply used as a token key.
- **`provideType`**  **Object**  An object with various options on how to provide the dependency. Only one of the following should be used:
    - **`provideType.useValue`**  **[any]**  If used, the value is provided when the token is requested from the injector.
    - **`provideType.useConstant`**  **[any]**  If used, the constant is provided when the token is requested from the injector.
    - **`provideType.useClass`**  **[class]**  If used, the class is provided when the token is requested from the injector. This is equivalent to adding [@Injectable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable) to a class. But could be useful to overwrite an existing @Injectable with a new provided class.
    - **`providerType.useFactory`**  **[Function]**  If used, the return value of the factory function is provided when the token is requested from the injector. You can also inject the function by supplying an array of dependencies to `providerType.deps`.
    - **`providerType.deps`**  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Only used along with `useFactory` to inject dependencies.

Returns a [Provider](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#provider).

###### Provider

A generic dependency that is fulfilled by either value, constant, class or factory based on a unique token. To create Providers, use [provide](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#provide).

###### OpaqueToken

Used to create a object to be used as a token with [`provide`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#provide)

Example:

```js
import { provide, OpaqueToken } from 'ng-forward';

const CONFIG_VAL = new OpaqueToken('configVal');

@Component({
    ...
    providers: [
        provide(CONFIG_VAL, { useConstant: 100 })
    ]
})
@Inject(CONFIG_VAL)
class App {}
```

###### Behind the Scenes

- `useValue` spurs a call to `module.value`
- `useConstant` spurs a call to `module.constant`
- `useClass` spurs a call to `module.service`
- `useFactory` spurs a call to `module.factory`

## IProvidable

Anything that can be passed as a provider that you want to include in the bundle. Can be of type **string**, **class**, or **Provider**.

- If **string**, will be considered an angular 1 legacy module. E.g. 'ui-router', 'my-other-ng1-module'.
- If **class**, must be an [@Injectable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable) and will add that 'service' to the bundle. Regular ES6 classes will throw an error.
- If [**Provider**](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#provider), will be included in bundle as specified.

## @Pipe

A decorator for adding pipe metadata to a class. Pipes are essentially the same as angular 1 filters.

Example:
```js
import { Pipe, Component } from 'ng-forward';

@Pipe
class FirstLetter {

    // Mandatory
    transform(input, changeTo) {
        input[0] = changeTo;
        return input;
    }

    // Optional
    supports(input) {
        return typeof input === 'string';
    }
}

@Component({
    pipes: [FirstLetter],
    template: `{{ 'foo' | firstLetter:'z' }}` // Will change to 'zoo'
})
class Thing {}
```

###### Behind the Scenes

`module.filter` is called

## @StateConfig

A decorator for adding ui-router state configurations.

Example:
```js
import { Component, StateConfig } from 'ng-forward';
import uiRouter from 'ui-router';

@Component({
    selector: 'childA',
    template: '{{ childA.text }}' // will be 'A resolved!'
})
@Inject('resolveA')
class ChildA {
    constructor(resolveA) {
        this.text = resolveA;
    }
}

@Component({
    selector: 'parent',
    providers: [uiRouter],
    template: `<ng-outlet></ng-outlet>` // or <ui-view>
})
@StateConfig([
    { name: 'childA', url: '/childA', component: ChildA, resolve: { resolveA: () => 'A resolved!' } },
    { name: 'childZ', url: '/childZ', component: ChildZ }
])
class Parent {}
```

###### Parameters

- **`stateConfigs`**  **Array&lt;Object&gt;**  An array of state configurations, [see ui-router docs](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider#methods_state).
- **`stateConfigs[].component`**  **class**  In addition to all the normal config properties, you can route to a @Component class. The component will populate the `ui-view` when the state becomes active.

###### Behind the Scenes

Calls to `$stateProvider.state` are made. All `resolve`'s are added as locals for injection on the @Component's constructor.

## @Resolve

A decorator to be used in place of the `resolve` ui-router state property. You place this decorator on a static function and it will add that function to the state's resolve map. It is convenient because you can store the Resolve information alongside the component that needs it, instead of the parent.

Example:

```js
import { Component, StateConfig } from 'ng-forward';
import uiRouter from 'ui-router';

@Component({
    selector: 'childA',
    template: '{{ childA.text }}' // will be 'A resolved!'
})
@Inject('resolveA')
class ChildA {

    @Resolve()
    static resolveA() {
        return 'A resolved!';
    }

    constructor(resolveA) {
        this.text = resolveA;
    }
}

@Component({
    selector: 'parent',
    providers: [uiRouter],
    template: `<ng-outlet></ng-outlet>` // or <ui-view>
})
@StateConfig([
    { name: 'childA', url: '/childA', component: ChildA },
    { name: 'childZ', url: '/childZ', component: ChildZ }
])
class Parent {}
```

###### Parameters

- **`resolveName`**  **[string]**  If provided, you will use this name when requesting the resolve from the injector.

## DecoratedModule 

A wrapper around the angular 1 module. This is mostly private and you shouldn't need to use it unless you are creating a plugin.

#### `add()`

Add an annotated class to the angular module.

###### Parameters

- **`providers`**  **...class**  One or more annotated classes to add to the module. Annotated classes need to have previously registered a parser with Module via `Module.addProvider` (an internal method used for adding decorators).

Returns the `DecoratedModule`.

#### `publish()`

Returns the raw angular 1 module.

#### `config()`

Adds a config function to the module.

###### Parameters

- **`configFn`** **Function** A function to be ran during config phase of the angular module

#### `run()`

Adds a run function to the module.

###### Parameters

- **`runFn`** **Function** A function to be ran during run phase of the angular module

## getInjectableName

A utility function that can be used to get the angular 1 injectable's name. Needed for some cases, since injectable names are auto-created.

Example:
```js
import { Injectable, getInjectableName } from 'ng-forward';

// this is given some random name like 'MyService48' when it's created with `module.service`
@Injectable
class MyService {}

console.log(getInjectableName(MyService)); // 'MyService48'

```

## TestComponentBuilder

WIP

## ComponentFixture

WIP
