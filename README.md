# angular-decorators [![Build Status](https://travis-ci.org/MikeRyan52/angular-decorators.svg?branch=master)](https://travis-ci.org/MikeRyan52/angular-decorators)

Angular 2, due to be released this year, offers a drastically different API for creating applications in comparison to Angular 1.x. angular-decorators provides decorators and utilities that allow you to write AngularJS 1.x apps in a similar way to this new API. By taking advantage of these decorators and utilities, porting your existing AngularJS 1.x apps to Angular 2 will be a quicker, less painful process.

## Modules

The standard `angular.module` does not understand the metadata attached to your classes or functions from this library's decorators. You must use the provided Module class to create Angular modules. Using it is very similar to `angular.module`:

```js
import {Module} from 'angular-decorators';

// Create a new module:
let myModule = Module('my-module', ['ui.bootrap', 'ui.router']);

// Reference a pre-existing module:
let otherModule = Module('my-module');
```

### Adding Decorated Classes

```js
import {Service, Module} from 'angular-decorators';

@Service('MyService')
class MyService{ }

Module('my-module', []).add(MyService);
```

### Accessing Internal AngularJS Module

```js
let angularModule = myModule.add(AnnotatedClass).publish();
```

### Module Dependencies

You do not need to publish a module to add it as a dependency to another module:

```js
let myModule = Module('my-module', []);
let otherModule = Module('other-module', [ myModule ]);
```

This works for traditional AngularJS modules:
```js
let otherModule = angular.module('other-module', []);
let myModule = Module('my-module', [ otherModule ]);
let lastModule = angular.module('last-module', [ myModule.name ]);
```

## decorators

The decorators provided in this package follow [this proposal](https://github.com/jonathandturner/brainstorming/blob/master/README.md). They work by adding metadata to your classes and functions under the `$ng-decs` namespace. 

### Inject

The `@Inject` decorator let's you specify dependencies to Angular's dependency injector:

```js
@Inject('$q', '$http')
class MyService{
	constructor($q, $http){

	}
}
```

When used with inheritance, child dependencies are placed before parent dependencies letting you easily capture parent dependencies using a rest parameter:

```js
@Inject('$q', '$http')
class Parent{
	constructor($q, $http){

	}
}

@Inject('$timeout')
class Child extends Parent{
	constructor($timeout, ...parentDependencies){
		super(...parentDependencies);
	}
}
```

### Component

The `@Component` decorator let's you easily create components in AngularJS by wrapping the directive API and setting you up with sensible defaults:

```js
import {Component, Module} from 'angular-decorators';

@Component({ selector : 'my-component' })
class MyComponentCtrl{
	constructor(){ }
}

Module('my-component-module', []).add(MyComponentCtrl);
```

Becomes:

```js
angular.module('my-component-module', [ ])

.directive('myComponent', function(){
	return {
		restrict : 'E',
		controller : function MyComponentCtrl{ },
		controllerAs : 'myComponent',
		scope : { },
		bindToController: true
	};
});
```

#### Binding Element Attributes to the Controller

Supply an array to properties key of your config object using Angular 2 property syntax:

```js
@Component({
	selector: 'my-component',
	properties: [
		'myProp: =renamedProp',
		'@anotherAttribute'
	]
})
class MyComponentCtrl
```

This becomes:

```js
.directive('myComponent', function(){
	return {
		restrict: 'E',
		controller: function MyComponentCtrl{ },
		controllerAs: 'myComponent',
		scope: {},
		bindToController: {
			'myProp' : '=renamedProp',
			'anotherAttribute' : '@'
		}
	}
})
```

#### Renaming `controllerAs`

By default, the `controllerAs` property is set to a camel-cased version of your selector (i.e. `my-own-component`'s `controllerAs` would be `myOwnComponent`'). Changing it is easy:

```js
@Component({
	selector: 'my-component',
	controllerAs: 'vm'
})
```

#### Changing Scope

By default, isolate scopes are created for each component. It is strongly recommended that you structure your components to always create isolate scopes, but if you need to change this it can be specified in the component config object:

```js
@Component({
	selector: 'my-component',
	scope: false
})
```


##### Component Inheritance
One major benefit of structuring your components this way is that it now becomes much easier to extend components:

```js
@Component({ selector : 'animal', bind : { name : '@' } })
@Inject('$q')
class Animal{
	constructor($q){
		this.type = 'Animal';
		console.log(`${this.name} the ${this.type}`);
	}
}


@Component({ selector : 'frog' })
@Inject('RibbitFactory')
class Frog extends Animal{
	constructor($q, RibbitFactory){
		this.type = 'Frog';
		super($q);
	}
}
```

Then in your HTML:

```html
<frog name="Kermit"></frog>
```

Output: `Kermit the Frog`

##### About the Require decorator
In AngularJS, when your directive requires multiple other directive controllers they are passed to your link function as an array:

```js
myModule.directive('myComponent', function(){
	return {
		require : ['^parent', 'sibling'],
		link : function(scope, element, attrs, controllers){
			var parent = controllers[0];
			var sibling = controllers[1];
		}
	};
});
```

As a convenience, when you use the `@Require` decorator your class is decorated with an `unpackRequires` method to make it easy to reference your required components:

```js
@Component({ selector : 'my-component' })
@Require('^parent', 'sibling')
class MyComponent{
	static link(scope, element, attrs, controllers){
		let {parent, sibling} = MyComponent.unpackRequires(controllers);
	}
}
```

### Decorator
The `@Decorator` decorator is identical to the `@Component` decorator, except you use `@Decorator` for directives that you want to restrict to a class or attribute:

```js
@Decorator({ selector : '[my-attr]' })
class MyAttrCtrl{
	constructor(){

	}
}

@Decorator({ selector : '.my-class' })
class MyClassCtrl{
	constructor(){

	}
}
```


### Service
The `@Service` decorator simply turns your class/function into a service:

```js
let myServiceModule = new Module('my-service');

@Service
class MyService{
	constructor(){

	}
}

myServiceModule.add(MyService);
```

becomes:

```js
var myServiceModule = angular.module('my-service', [

])

.service('MyService', function MyService(){
	
});

```

### Factory
The factory decorator is a complex decorator that assumes:

1. You have a class that requires parameters on instantiation
2. The parameters differ from injected AngularJS services

For example, if you had a class that looked like this:

```js
class Post{
	constructor($http, title, content){

	}
}
```

and you wanted to make a factory that created a `Post` with a provided title and content, you could do the following:

```js
@Factory('PostFactory')
@Inject('$http')
class Post{
	constructor($http, title, content){

	}
}
```

Then, in some other component you would be able to access the factory like this:

```js
@inject('PostFactory')
class NewPostService{
	constructor(PostFactory){
		let post = PostFactory('Title', 'Some content');
	}
}
```

If you want more control over the factory function, just add a static create method to your factory class:

```js
@Factory('CommentFactory')
@Inject('$http', '$q')
class Comment{
	constructor($http, $q, postID, comment){

	}

	static create(dependencies, post, comment){
		return new Comment(...dependencies, post.id, comment);
	}
}
```

## Adding Your Own Providers

Adding your own providers through decorators is very easy. To demonstrate, let's create a `@Route` decorator that lets you setup router configuration for Anguar 1.4's new router:

```js
// First we setup the Router decorator function:
export function Route(config){
	return function(target){
		target.$routeConfig = config;

		target.$provider = target.$provider || {};
		target.$provider.type = 'routeController';
		target.$provider.name = target.name;
	}
}

// Then we need to setup the parser:
import {Module} from 'angular-decorators';

Module.registerProvider('routeController', (provider, module) => {
	// Provider parsers accept the anotated provider class/function 
	// and the target angular module

	module.controller(provider.$provider.name, 
		['$router', ...provider.$inject, 
		function($router, ...dependencies){
			return new provider(...dependencies);
		}
	]);
});

// Now we can use our Router decorator:
@Route({ path : '/', component : 'home' })
@Inject('$q')
class HomeController{
	constructor($q){

	}
}
```