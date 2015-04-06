import {Component} from './component';
import {expect} from 'chai';

describe('@Component annotation', function(){
	it('should decorate a class with the $provider and $component metadata', function(){
		@Component({ selector : 'my-component' })
		class MyClass{ }

		expect(MyClass).to.have.property('$provider');
		expect(MyClass).to.have.property('$component');
	});

	it('should correctly add restrict : "E"', function(){
		@Component({ selector : 'my-component' })
		class MyClass{ }

		expect(MyClass.$component).to.have.property('restrict', 'E');
	});

	it('should throw an error if the selector is not an element', function(){
		let caughtAttr = false;
		let caughtClass = false;

		try{
			@Component({ selector : '[my-attr]' })
			class MyClass{ }
		}
		catch(e){
			caughtAttr = true;
		}

		try{
			@Component({ selector : '.my-class' })
			class MyClass{ }
		}
		catch(e){
			caughtClass = true;
		}

		expect(caughtAttr).to.be.ok;
		expect(caughtClass).to.be.ok;
	});

	it('should accept a binding property', function(){
		@Component({
			selector : 'my-component',
			bind : { 'myAttr' : '@' }
		})
		class MyClass{ }

		expect(MyClass.$component.scope).to.have.property('myAttr', '@');
		expect(MyClass.$component.bindToController).to.be.ok;
	});
});