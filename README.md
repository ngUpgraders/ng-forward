# angular-decorators [![Build Status](https://travis-ci.org/MikeRyan52/angular-decorators.svg?branch=master)](https://travis-ci.org/MikeRyan52/angular-decorators)

angular-decorators is a library of ES7 decorators for writing Angular 2 style code in AngularJS.

**Installation via npm**

`npm install angular-decorators --save`

**Installation via jspm**

`jspm install angular-decorators`

_[Looking for the 0.1x docs?](https://github.com/MikeRyan52/angular-decorators/blob/v0.1.x/README.md)_

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

The decorators provided in this package follow [this proposal](https://github.com/jonathandturner/brainstorming/blob/master/README.md). They work by adding metadata to your classes under the `$ng-decs` namespace using the reflect-metadata polyfill.

### Inject

The `@Inject` decorator lets you specify dependencies to AngularJS's dependency injector:

```js
@Inject('$q', '$http')
class MyService{
	constructor($q, $http){

	}
}
```

When inheriting from a decorated class, child dependencies are specified before parent dependencies letting you capture parent dependencies using a rest parameter:

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

The `@Component` decorator lets you create components in AngularJS by wrapping the directive API and setting you up with sensible defaults:

```js
import {Component, Module} from 'angular-decorators';

@Component({ selector : 'my-component' })
class MyComponentCtrl{
	constructor(){ ... }
}

export default Module('my-component-module', []).add(MyComponentCtrl);
```

The directive definition object generated for the above component is:

```js
{
  controller: MyComponentCtrl,
  controllerAs: 'myComponent',
  bindToController: true,
  scope: {},
  restrict: 'E'
}
```

##### Binding Element Attributes to the Controller

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

##### Renaming `controllerAs`

By default, the `controllerAs` property is a camel-cased version of your selector (i.e. `my-own-component`'s `controllerAs` would be `myOwnComponent`'). You can override this by specifying a new name in the `@Component:

```js
@Component({
	selector: 'my-component',
	controllerAs: 'vm'
})
```

##### Changing Scope
By default, components create new, isolate scopes but this can be manually set in the component config object:

```js
@Component({
	selector: 'my-component',
	scope: false
})
```

##### Setting the Template
Templates are added with the `@View` decorator. Pass in a config object with either an inline `template` or a `templateUrl`:

```js
import {Component, View} from 'angular-decorators';

@Component({ selector: 'my-component' })
@View({ template: `<h1>My Component Template</h1>` })
class MyComponentCtrl{ ... }

@Component({ selector: 'another-component' })
@View({ templateUrl: '/path/to/template.html' })
class AnotherComponentCtrl{ ... }
```

##### Requiring Other Directives
Use the `@Require` decorator to require directive controllers and access them using the static link function:

```js
import {Component, Require} from 'angular-decorators';

@Component({ selector : 'my-component' })
@Require('^parent', 'myComponent')
class MyComponent{
	static link(scope, element, attrs, controllers){
		let [parent, self] = controllers;

		self.parent = parent;
	}
}
```

#### Transclusion
Use the `@Transclude` decorator to setup transclusion for your component:

```js
import {Component, Transclude} from 'angular-decorators';

@Component({ selector: 'my-component' })
@Transclude
class MyComponent{ ... }
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

Note that unlike `@Component`, `@Directive` does not create a new isolate scope by default nor does it expose your directive's controller on the scope.

### Filter
The `@Filter` decorator let's you write class-based filters similar to Angular 2's Pipes:

```js
import {Filter, Module} from 'angular-decorators';

@Filter('trim')
class TrimFilter{
	supports(input){
		return (typeof input === 'string');
	}
	transform(input, param){
		return input.trim();
	}
}

export default Module('trim-filter', []).add(TrimFilter);
```

The support function is an optional test against the input. If the support function returns false the generated filter will throw an error instead of applying the transform.

### Service
The `@Service` decorator turns your class into a service:

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

and you wanted to make a factory that created a `Post` with a parameters for title and content, you could do the following:

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

## Extending angular-decrators
#### Adding Your Own Providers
You can register your own providers using `Module.addProvider`. For instance, if you want to add a new decorator called `@RouteableComponent` that hooked up a component to the upcoming router, you would start by creating a decorator that set a provider name and type on a class:

```js
import {providerWriter} from 'angular-decorators/writers';

export default const RouteableComponent = name => targetClass => {
  providerWriter.set('type', 'routeable-component', targetClass);
  providerWriter.set('name', name, targetClass);
}
```

Then you'll need to register your custom parser:

```js
import Module from 'angular-decorators/module';

Module.addProvider('routeable-component', (provider, name, injectables, ngModule) => {
  // implement parsing logic here, adding necessary config/directives/etc to the raw ngModule
});
```

#### Extending the Directive Parser
The directive definiton object is derived from all key/value pairs set with the `providerWriter`. Here's an example of creating a priority decorator that sets a directive's priority:

```js
import {componentWriter} from 'angular-decorators';

export const Priority = level => target => componentWriter.set('priority', level, target);
```

