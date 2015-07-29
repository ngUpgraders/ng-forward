# ng-forward

[![Join the chat at https://gitter.im/ngUpgraders/ng-forward](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ngUpgraders/ng-forward?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The default solution for those that want to write Angular 2.x style code in Angular 1.x

*Currently in the Design phase, please participate over here: [Google Drive Design Doc](https://docs.google.com/document/d/1oq0T0-jicGzc5uYJc0LE1ZBHm0w1lhVB4IVqUPXWSCg/edit)*


Example:

```js
import 'babel/polyfill';
import 'angular';
import 'zone.js';
import uiRouter from 'angular-ui-router';
import {Component, View, Inject, bootstrap} from 'ng-forward';

@Inject('$state')
class Test{
	constructor($state){
		this.isReal = true;
		console.log($state);
	}

	getValue(){
		return new Promise(resolve => {
			setTimeout(() => resolve(30), 3000);
		});
	}
}

@Component({ selector: 'nested' })
@View({ template: '...' })
class Nested{ }

@Component({
	selector: 'inner-app',
	properties: ['message'],
	events: ['test']
})
@View({
	directives: [Nested],
	template: `
		<h2 on-click="innerApp.emmit()">Inner app</h2> <nested></nested>
		<div ng-if="innerApp.num">{{ innerApp.num }}</div>
	`
})
@Inject(Test, '$element')
class InnerApp{
	constructor(test, $element){
		this.$element = $element;
		this.test = test;
		this.resolveValue();
		console.log(this);
		console.log(this.message);
	}

	async resolveValue(){
		this.num = await this.test.getValue();
	}

	emmit(){
		this.TestEmitter.onNext();
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
		<inner-app on-test="app.onTest()" bind-message="app.message"></inner-app>
	`
})
class AppCtrl{
	constructor(){
		this.triggers = 0;
		this.message = 'Hi, inner app!';
	}
	onTest(){
		this.triggers++;
	}
}

bootstrap(AppCtrl);


```
