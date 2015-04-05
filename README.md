# angular-es6

Angular 2, due to be released this year, offers a drastically different API for creating applications. angular-es6 provides annotations and utilities that allow you to write AngularJS 1.x apps in a similar way to this new API. By taking advantage of these annotations and utilities, porting your existing AngularJS 1.x apps to Angular 2 will be a quicker, less painful process.

## Annotations

The annotations provided in this package follow [this proposal](https://github.com/jonathandturner/brainstorming/blob/master/README.md). They work by adding meta information to your classes and functions under the `$component` and `$provider` namespaces. 

### Component

The `@Component` annotation transforms a class into a directive:

```js
let myModule = new Module('my-component-module');

@Component({ 
	selector : 'my-component',
	bind : { 'myAttrA' : '=', 'myAttrB' : '&' }
})
@Inject('$element', '$attrs')
@Template({ url : '/path/to/template.html' })
@Require('requiredComponent')
class MyComponent{
	constructor($element, $attrs){

	}

	static link(scope, element, attrs, requiredComponent)
	{

	}
}

myModule.register(MyComponent).publish();
```

would become:

```js
function MyComponent($element, $attrs){
	
}

MyComponent.$inject = ['$element', '$attrs'];

MyComponent.link = function(scope, element, attrs, requiredComponent){

}

angular.module('my-component-module', [

])

.directive('myComponent', function(){
	return {
		restrict : 'E',
		controller : MyComponent,
		controllerAs : 'MyComponent',
		templateUrl : '/path/to/template.html',
		link: MyComponent.link,
		scope : {
			'myAttrA' : '=',
			'myAttrB' : '&'
		},
		bindToController: true
	};
});
```