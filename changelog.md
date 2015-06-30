# v1.0.0

## Breaking Changes

#### Inject decorator now places new injects at the front of the injection array rather than at the end

Given:

```js
@Inject('$http', '$q')
class Parent{ }

@Inject('$timeout')
class Child extends Parent{ }
```

Before, injection array on `Child` would have been `'$http', '$q', '$timeout'`. Starting with v1.0 it will now equal `'$timeout', '$http', '$q'`. This makes it easy for subclasses to capture parent dependencies using a rest parameter:

```js
@Inject('$timeout')
class Child extends Parent{
	constructor($timeout, ...parentDependcies){
		super(...parentDependencies);
	}
}
```

#### Metadata is now installed on classes using a polyfill of the Reflect metadata API 

#### @Template decorator has been renamed to @View to align with Angular 2 API

#### @Decorator decorator has been renamed to @Directive to align with new Angular 2 API

#### @Component decorator now sets `scope: {}` by default on the direct definition object. Previously, it did not set any value for scope

#### Provider parsers are now passed the provider, name, injection array, and Angular module

Previous:
```js
Module.registerProvider('myProvider', function(provider, ngModule){ });
```

After:
```js
Module.registerProvider('myProvider', function(provider, providerName, injectionArray, ngModule){ });
```

#### Classes are no longer decorated with an `unpackRequires` static method for handling requires

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