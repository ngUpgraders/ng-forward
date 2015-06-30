# angular-decorators [![Build Status](https://travis-ci.org/MikeRyan52/angular-decorators.svg?branch=master)](https://travis-ci.org/MikeRyan52/angular-decorators)

angular-decorators is a library of ES7 decorators for writing Angular 2 style code in AngularJS.

## Installation via npm

`npm install angular-decorators --save-dev`

## Installation via jspm

`jspm install angular-decorators`

## Modules

The standard `angular.module` does not understand the metadata attached to your classes from this library's decorators. Use the provided Module function to create Angular modules:

```js
import {Module} from 'angular-decorators';

// Create a new module:
let myModule = Module('my-module', ['ui.bootrap', 'ui.router']);

// Reference a pre-existing module:
let otherModule = Module('my-module');
```

Adding decorated classes is easy:

```js
import {Service, Module} from 'angular-decorators';

@Service('MyService')
class MyService{ }

Module('my-module', []).add(MyService);
```

As is accessing the internal `angular.module` (if you need it):

```js
let angularModule = myModule.add(AnnotatedClass).publish();
```

It also supports `config` and `run` blocks:

```js
Module('example', []).config(...).run(...);
```

### Module Dependencies

You do not need to publish a module to add it as a dependency to another module:

```js
let myModule = Module('my-module', []);
let otherModule = Module('other-module', [ myModule ]);
```

This works for vanilla AngularJS modules as well:
```js
let otherModule = angular.module('other-module', []);
let myModule = Module('my-module', [ otherModule ]);
let lastModule = angular.module('last-module', [ myModule.name ]);
```

## Decorators

The decorators provided in this package follow [this proposal](https://github.com/jonathandturner/brainstorming/blob/master/README.md). They work by adding metadata to your classes and functions under the `$ng-decs` namespace using the reflect-metadata polyfill.

### Inject

The `@Inject` decorator let's you specify dependencies to AngularJS's dependency injector:

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

<<<<<<< HEAD
The `@Component` annotation transforms a class into a directive, where the class becomes the directive's controller and the `controllerAs` property is the name of the class.

You could also set the name of controller used for component template using `controllerAs` parameter. It could be very handy in case you wrap your Angular 1.x directives with `@Component` decorator and don't want to change every template.
=======
The `@Component` decorator let's you easily create components in AngularJS by wrapping the directive API and setting you up with sensible defaults:
>>>>>>> feature/version-1

```js
import {Component, Module} from 'angular-decorators';

<<<<<<< HEAD
@Component({ 
	selector : 'my-component',
	controllerAs : 'vm',
	bind : { 'myAttrA' : '=', 'myAttrB' : '&' }
})
@Template({ url : '/path/to/template.html' })
@Require('requiredComponent')
@Inject('$element', '$attrs')
=======
@Component({ selector : 'my-component' })
>>>>>>> feature/version-1
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
<<<<<<< HEAD
		controller : MyComponentCtrl,
		controllerAs : 'vm',
		templateUrl : '/path/to/template.html',
		link: MyComponentCtrl.link,
		scope : {
			'myAttrA' : '=',
			'myAttrB' : '&'
		},
=======
		controller : function MyComponentCtrl{ },
		controllerAs : 'myComponent',
		scope : { },
>>>>>>> feature/version-1
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

##### Require decorator
Use the `@Require` decorator to require directive controllers and access them using the static link function:

```js
@Component({ selector : 'my-component' })
@Require('^parent', 'myComponent')
class MyComponent{
	static link(scope, element, attrs, controllers){
		let [parent, self] = controllers;

		self.parent = parent;
	}
}
```

### Directive
The `@Directive` decorator is like the `@Component` decorator, except you use `@Directive` for directives that you want to restrict to a class or attribute:

```js
import {Directive} from 'angular-decorators';

@Directive({ selector: '[my-attr]' })
class MyAttrCtrl{
	constructor(){

	}
}

@Directive({ selector: '.my-class' })
class MyClassCtrl{
	constructor(){

	}
}
```

It is important to note that unlike `@Component`, `@Directive` does not create a new, isolate scope by default nor does it expose your directive's controller on the scope.

### Filter
The `@Filter` decorator let's you write class-based filters similar to Angular 2's Pipes:

```js
import {Filter, Module} from 'angular-decorators';

@Filter('trim')
class TrimFilter{
	supports(input){
		return (typeof input === 'string');
	}
	transform(input){
		return input.trim();
	}
}

export default Module('trim-filter', []).add(TrimFilter);
```

### Service
The `@Service` decorator simply turns your class into a service:

```js
import {Service, Inject, Module} from 'angular-decorators';

@Service('MyService')
@Inject('$q')
class MyService{
	constructor($q){
		this.$q = $q;
	}
}

export default Module('my-service', []).add(MyService);
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
import {Factory, Inject, Module} from 'angular-decorators';

@Factory('PostFactory')
@Inject('$http')
class Post{
	constructor($http, title, content){

	}
}

export default Module('post-factory', []).add(PostFactory);
```

When injected elsewhere use the factory like this:

```js
import {Inject, Service, Module} from 'angular-decorators';
import PostFactory from './post-factory';

@Service('SomeService')
@Inject('PostFactory')
class SomeService{
	constructor(PostFactory){
		let post = PostFactory('Title', 'Some content');
	}
}

export default Module('some-service', [PostFactory]).add(SomeService);
```

You can override the default factory function by implementing a static create function:

```js
import {Factory, Inject, Module} from 'angular-decorators';

@Factory('CommentFactory')
@Inject('$http', '$q')
class Comment{
	constructor($http, $q, postID, comment){

	}

	static create(dependencies, post, comment){
		return new Comment(...dependencies, post.id, comment);
	}
}

export default Module('comment-factory', []).add(Comment);
```

## Adding Your Own Providers

<<<<<<< HEAD
Adding your own providers through annotations is very easy. To demonstrate, let's create a `@Route` annotation that lets you setup router configuration for Anguar 1.4's new router:

```js
// First we setup the Router annotation function:
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

// Now we can use our Router annotation:
@Route({ path : '/', component : 'home' })
@Inject('$q')
class HomeController{
	constructor($q){

	}
}
```
=======
Coming soon!
>>>>>>> feature/version-1
