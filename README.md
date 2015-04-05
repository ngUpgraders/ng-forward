# angular-es6

Angular 2, due to be released this year, offers a drastically different API for creating applications. angular-es6 provides annotations and utilities that allow you to write AngularJS 1.x apps in a similar way to this new API. By taking advantage of these annotations and utilities, porting your existing AngularJS 1.x apps to Angular 2 will be a quicker, less painful process.

## Annotations

The annotations provided in this package follow [this proposal](https://github.com/jonathandturner/brainstorming/blob/master/README.md). They work by adding meta information to your classes and functions under the `$component` and `$provider` namespaces. 

### Inject

The `@Inject` annotation provides a shorthand for adding the `$inject` property to your classes and functions. This is really convenient for classes as you can specify your injected dependencies on the constructor:

```js
class MyService{
	@Inject('$q', '$http')
	constructor($q, $http){

	}
}
```

becomes:

```js
function MyService($q, $http){
	
}

MyService.$inject = ['$q', '$http'];

```

### Component

The `@Component` annotation transforms a class into a directive:

```js
let myModule = new Module('my-component-module');

@Component({ 
	selector : 'my-component',
	bind : { 'myAttrA' : '=', 'myAttrB' : '&' }
})
@Template({ url : '/path/to/template.html' })
@Require('requiredComponent')
class MyComponentCtrl{
	@Inject('$element', '$attrs')
	constructor($element, $attrs){

	}

	static link(scope, element, attrs, requiredComponent){

	}
}

myModule.register(MyComponentCtrl).publish();
```

would become:

```js
function MyComponentCtrl($element, $attrs){
	
}

MyComponentCtrl.$inject = ['$element', '$attrs'];

MyComponentCtrl.link = function(scope, element, attrs, requiredComponent){

}

angular.module('my-component-module', [

])

.directive('myComponent', function(){
	return {
		restrict : 'E',
		controller : MyComponentCtrl,
		controllerAs : 'MyComponentCtrl',
		templateUrl : '/path/to/template.html',
		link: MyComponentCtrl.link,
		scope : {
			'myAttrA' : '=',
			'myAttrB' : '&'
		},
		bindToController: true
	};
});
```


### Service
The `@Service` annotation simply turns your class/function into a service:

```js
let myServiceModule = new Module('my-service');

@Service
class MyService{
	constructor(){

	}
}

myServiceModule.register(MyService).publish();
```

becomes:

```js
var myServiceModule = angular.module('my-service', [

])

.service('MyService', function MyService(){
	
});

```

### Factory
The factory annotation is a complex annotation that assumes:

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
@Factory
class Post{
	@Inject('$http')
	constructor($http, title, content){

	}
}
```

Then, in some other component you would be able to access the factory like this:

```js
class NewPostService{
	@inject('PostFactory')
	constructor(PostFactory){
		let post = PostFactory('Title', 'Some content');
	}
}
```

If you want more control over the factory function, just add a static create method to your factory class:

```js
@Factory
class Comment{
	@Inject('$http')
	constructor($http, postID, comment){

	}

	static create(dependencies, post, comment){
		return new Comment(...dependencies, post.id, comment);
	}
}
```