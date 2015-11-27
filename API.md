# API Reference

WIP, Help Wanted!! Just fill something in! Be consistent with other sections.

## bootstrap

Used to bootstrap your ng-forward application. Do **not** use the `ng-app` directive.

Example:

```js
import { bootstrap, Component } from 'ng-forward';

@Component({ selector: 'app', template: 'Hello World!' })
class App { }

bootstrap(App);
```

> **Behind the Scenes:** `bundle` is called to auto-create an angular module and then angular.bootstrap is called on the page element that matches the component's selector.

###### Parameters

- `component`  **class**  Any class that has been decorated with @Component.
- `otherProviders`  **[Array&lt;string | class | Provider&gt;]**  An array of other providers that you want to include in the bundle.
    - If **string**, will be considered an angular 1 legacy module. E.g. 'ui-router', 'my-other-ng1-module'.
    - If **class**, must be an @Injectable and will add that 'service' to the bundle. Regular ES6 classes will throw an error.
    - If **Provider**, will be included in bundle as specified.

Returns the `injector` from the bootstrapped auto-bundled module.

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

> **Behind The Scenes:** angular.module is called. All string-based providers are considered ng 1 modules and passed as deps to angular.module. All other providers are added as whatever is appropriate: @Component calls module.directive, @Pipe calls module.filter, @Injectable calls module.service.

###### Parameters

- `moduleName` **string** The name of the module to be created
- `provider` **class** The entry point provider whose dependencies (providers, directives) will be traced and bundled.
- `otherProviders`  **[Array&lt;string | class | Provider&gt;]**  An array of other providers that you want to include in the bundle.
    - If **string**, will be considered an angular 1 legacy module. E.g. 'ui-router', 'my-other-ng1-module'.
    - If **class**, must be an @Injectable and will add that 'service' to the bundle. Regular ES6 classes will throw an error.
    - If **Provider**, will be included in bundle as specified.

## @Component

### jqlite extensions

## @Directive

## @Injectable

## @Inject

## Provider, provide

## @Pipe

## @Input

## @Output

### EventEmitter

## @StateConfig

### @Resolve

## getInjectableName

## Testing

### TestComponentBuilder

### ComponentFixture