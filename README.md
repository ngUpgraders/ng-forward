This is an experimental branch of angular-decorators. It abstracts away the need to create modules by further mimicking angular2 syntax. Example:

```js
import 'angular';
import {Component, View, Inject, Service, bootstrap} from 'angular-decorators';

@Service('Test')
class Test{
	constructor(){
		this.isReal = true;
	}
}

@Component({
	selector: 'inner-app'
})
@View({
	template: '<h2>Inner app</h2>'
})
@Inject(Test)
class InnerApp{
	constructor(test){
		console.log(test);
	}
}

@Component({
	selector: 'app',
	viewInjector: [Test]
})
@View({
	directives: [InnerApp],
	template: `
		<h1>Hello, world!</h1>
		<inner-app></inner-app>
	`
})
class AppCtrl{ }

bootstrap(AppCtrl);
```
