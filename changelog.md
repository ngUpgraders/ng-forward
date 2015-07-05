# v1.0.0

## New Features

* `@Animation` decorator for creating animation providers
* `@Provider` decorator for creating raw providers
* `@Filter` decorator for defining Angular 2 pipe-style filters
* `@Component({ properties: [ 'myAttr: =renamedAttr' ] })` for defining properties Angular 2 style

## Breaking Changes

**Inject decorator now places new injects at the front of the injection array rather than at the end**

Given:

```js
@Inject('$http', '$q')
class Parent{ }

@Inject('$timeout')
class Child extends Parent{ }
```

Before, injection array on `Child` would have been `['$http', '$q', '$timeout']`. Starting with v1.0 it will now be `['$timeout', '$http', '$q']`. This makes it easy for subclasses to capture parent dependencies using a rest parameter:

```js
@Inject('$timeout')
class Child extends Parent{
	constructor($timeout, ...parentDependcies){
		super(...parentDependencies);
	}
}
```



**Metadata is now installed on classes using a polyfill of the Reflect metadata API**

angular-decorators uses two libraries to achieve this:

* [reflect-metadata polyfill](https://github.com/rbuckton/ReflectDecorators) - Polyfill for the proposed Reflect Metadata API
* [metawriter](https://github.com/MikeRyan52/metawriter) - A small library that wraps the metadata API to add namespacing, iteration, and a map-like syntax



**`@Template` decorator has been renamed to @View to align with Angular 2 API**

Before:
```js
@Template({ url: '/path/to/it.html' })
class ComponentCtrl{ ... }

@Template({ inline: '<h2>Inline Template</h2>' })
class AnotherComponentCtrl{ ... }
```

After:
```js
@View({ templateUrl: '/path/to/it.html' })
class ComponentCtrl{ ... }

@View({ template: '<h2>Inline Template</h2>' })
class AnotherComponentCtrl{ ... }
```



**`@Decorator` decorator has been renamed to `@Directive` to align with new Angular 2 API. `@Directive` no longer exposes the controller on the scope.**

Before:
```js
@Decorator({ selector: '[my-attr]' })
class MyDecoratorCtrl{ ... }
```

After:
```js
@Directive({ selector: '[my-attr]' })
class MyDecoratorCtrl{ ... }
```



**`@Component` decorator now sets `scope: {}` by default on the directive definition object**

You can manually override this:

```js
@Component({ selector: 'my-component', scope: false })
class MyComponentCtrl{ ... }
```



**Provider parsers are now passed the provider, name, injection array, and Angular module**

Before:
```js
Module.registerProvider('myProvider', function(provider, ngModule){ });
```

After:
```js
Module.addProvider('myProvider', function(provider, providerName, injectionArray, ngModule){ });
```

**Classes are no longer decorated with an `unpackRequires` static method for handling requires**
This can be easily done using a destructuring assignment

Before:
```js
@Require('$http')
class MyClass{
	static link(scope, element, attrs, requires){
		let {$http} = MyClass.unpackRequires(requires);
	}
}
```

After:
```js
@Require('$http')
class MyClass{
	static link(scope, element, attrs, requires){
		let [$http] = requires;
	}
}
```