import './tests/frameworks';
import ngForward from './browsers';

xdescribe('ngForward Browser Bundle', () => {
	it('should let you use decorators and classes in es5', () => {
		const MyService = ngForward
			.Injectable()
			.class({
				constructor(){
					this.value = 123;
				}
			});
			
		const MyComponent = ngForward
			.Component({ selector: 'my-component' })
			.Inject(MyService)
			.class({
				constructor(service){
					this.value = service.value;
				}
			});
	});
});