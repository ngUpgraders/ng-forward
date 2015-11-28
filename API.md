# API Reference

WIP, Help Wanted!! Just fill something in! Be consistent with other sections.

#### Table of Contents

- [bootstrap](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bootstrap)
- [bundle](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bundle)
- [@Component](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component)
- [JQLite Extensions](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#jqlite-extensions)

## bootstrap

Used to bootstrap your ng-forward application. Do **not** use the `ng-app` directive.

Example:

```js
import { bootstrap, Component } from 'ng-forward';

@Component({ selector: 'app', template: 'Hello World!' })
class App { }

bootstrap(App);
```

###### Parameters

- `component`  **class**  Any class that has been decorated with [`@Component`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component).
- `otherProviders`  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  An array of other providers that you want to include in the bundle.

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

- `moduleName` **string** The name of the module to be created
- `provider` **class** The entry point provider whose dependencies (providers, directives) will be traced and bundled.
- `otherProviders`  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  An array of other providers that you want to include in the bundle.
    
Returns a [`DecoratedModule`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#decoratedmodule).

###### Behind The Scenes
`angular.module` is called. All string-based providers are considered ng 1 modules and passed as deps to angular.module. All other providers are added as whatever is appropriate: [`@Component`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#component) calls module.directive, [`@Pipe`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#pipe) calls module.filter, [`@Injectable`](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable) calls module.service, etc.

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

- `selector`  **string**  The component's selector. It must be a css tag selector, for example `'app'` or `'my-thing'` are **valid**, but `'[my-attr]'` or `'.my-class'` are **invalid**.
- `template`  **[string]**  The template string for the component. You can bind to class instance properties by prepending your bindings with the selector in camel-case form, e.g. `<h1>My Component's Name is: {{myComponent.name}}</h1>`.
- `templateUrl`  **[string]**  Path to an external html template file. Either `template` or `templateUrl` **must** be provided.
- `providers`  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Any providers that this component or any of it's children depends on.
- `directives`  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Any directives or components that this component or any of it's children depends on. 
- `pipes`  **[Array&lt;[IProvidable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#iprovidable)&gt;]**  Any [pipes](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#pipe) that this component or any of it's children depends on.
- `inputs`  **[Array&lt;string&gt;]**  An array of strings naming what class properties you want to expose in `bindToController` (or `scope` if angular 1.3). For example, `inputs: ['foo']` will connect the class property `foo` to the input `foo`. You can also rename the input, for example `inputs: ['foo:theFoo']` will connect the class property `foo` to the input `the-foo`.
- `outputs`  **[Array&lt;string&gt;]**  An array of strings naming what class properties you want to expose as outputs. For example, `outputs: ['fooChange']` will notify the app that this component can fire a `'fooChange'` event. If there is a class property `fooChange` that is an `EventEmitter` it can trigger this event via `this.fooChange.next()`. Otherwise the event can also be triggered with a regular DOM event of name `'fooChange'`. You can also rename the output, for example `inputs: ['fooChange:theFooChange']` will notify of a 'theFooChange' event, but will still look for a `fooChange` property on the class.
- `controllerAs`  **[string=selector camel-cased]**  The controller name used in the template.

###### Inputs and Outputs

Inputs and Outputs are the public API of a component. If you had a component `MenuDropdown` like so:

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
class MenuDropdown {}
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

At [bootstrap](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bootstrap) time, a call to angular.directive is made. Angular 1 directive properties are set as follows:

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

## JQLite Extensions

Ng-Forward adds the following extensions to the JQLite / JQuery object returned by angular.element. These extensions mimic features found in Angular 2.

#### nativeElement 

**read-only** The name element.

#### componentInstance

**read-only** The component's class instance. 

#### componentViewChildren

**read-only** An array of all child elements wrapped as jq elements.

#### getLocal(injectable)

An easy way to ask the injector for a dependency. You can pass either string or annotated class.

###### Parameters

- `injectable`  **string | class**  The string or annotated class you'd like to retrieve from the injector.

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

- `selector`  **string**  The component's selector. It must be a css attribute selector, for example `'[my-thing]'` is **valid**, but `'my-component'` or `'.my-class'` are **invalid**.
- `providers`  **[Array&lt;IProvidable&gt;]**  Any providers that this component or any of it's children depends on.

###### Behind the Scenes 

At [bootstrap](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#bootstrap) time, a call to angular.directive is made. Angular 1 directive properties are set as follows:

- `template` is not set.
- `controller` is set to the class instance, but it not instantiated until after the link phase so that child directives are available in the DOM. `$scope`, `$element`, `$attrs`, and `$transclude` are injectable as locals.
- `restrict` is set to 'A' since directives must use attribute-based selectors.
- `controllerAs` is set to a camel-cased version of the selector but can be overridden if you prefer 'vm' or something else.
- `scope` is not set and so is not isolated.
- `link` and `compile` are not set and are not able to be set.

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
 
module.service is called. The service name is auto-generated as you should not need to access manually. If you must access it, use the [getInjectableName()](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#getinjectablename) utility method.

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

- `injectables`  **string | class**  One or more injectables. Can be of type **string** or **class**.
    - If **string**, then it's considered a core angular service such as $q or $http. It could also be a special 'local', for example component's can inject $element, $attrs or $scope.
    - If **class**, then it's considered to be an annotated class that is injectable, for example via the [@Injectable](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#injectable) decorator.

###### Behind the Scenes

The injectables are added to the `$inject` property of the class constructor function.

## Provider, provide

## IProvidable

Anything that can be passed as a provider that you want to include in the bundle. Can be of type **string**, **class**, or **Provider**.
    - If **string**, will be considered an angular 1 legacy module. E.g. 'ui-router', 'my-other-ng1-module'.
    - If **class**, must be an @Injectable and will add that 'service' to the bundle. Regular ES6 classes will throw an error.
    - If **Provider**, will be included in bundle as specified.

## @Pipe

## @Input

## @Output

### EventEmitter

## @StateConfig

### @Resolve

## DecoratedModule 

A wrapper around the angular 1 module. This is mostly private and you shouldn't need to use it unless you are creating a plugin.

#### `add()`

Add an annotated class to the angular module.

###### Parameters

- `providers`  **...class**  One or more annotated classes to add to the module. Annotated classes need to have previously registered a parser with Module via `Module.addProvider` (an internal method used for adding decorators).

Returns the `DecoratedModule`.

#### `publish()`

Returns the raw angular 1 module.

#### `config()`

Adds a config function to the module.

###### Parameters

- `configFn` **Function** A function to be ran during config phase of the angular module

#### `run()`

Adds a run function to the module.

###### Parameters

- `runFn` **Function** A function to be ran during run phase of the angular module

## getInjectableName

## Testing

### TestComponentBuilder

### ComponentFixture
