This is an experimental branch of angular-decorators. It abstracts away the need to create modules by further mimicking angular2 syntax. Example:

```js
import 'angular';
import uiRouter from 'angular-ui-router';
import {Component, View, Inject, Injectables, Service, bootstrap} from 'angular-decorators';

@Inject('$state')
class Test{
	constructor($state){
		this.isReal = true;
		console.log($state);
	}
}

@Component({ selector: 'nested' })
@View({ template: '...' })
class Nested{ }

@Component({
	selector: 'inner-app',
	events: ['test']
})
@View({
	directives: [Nested],
	template: '<h2 on-click="innerApp.test()">Inner app</h2> <nested></nested>'
})
@Inject(Test, '$element')
class InnerApp{
	constructor(test, $element){
		console.log(test);

		this.$element = $element;
	}

	test(){
		this.$element.triggerHandler('test');
	}
}

@Component({
	selector: 'app',
	bindings: [Test, uiRouter]
})
@View({
	directives: [InnerApp, Nested],
	template: `
		<h1>Hello, world!</h1> <nested></nested>
		<span>Trigger count: {{ app.triggers }}</span>
		<inner-app on-test="app.onTest()"></inner-app>
	`
})
class AppCtrl{
	constructor(){
		this.triggers = 0;
	}
	onTest(){
		this.triggers++;
	}
}

bootstrap(AppCtrl);


```
