import {Component} from './component';
import chai from '../util/tests';

describe('@Component annotation', function(){
	it('should decorate a class with the $provider and $component metadata', function(){
		@Component({ selector : 'my-component' })
		class MyClass{ }

		MyClass.should.have.property('$provider');
		MyClass.should.have.property('$component');
	});

	it('should correctly add restrict : "E"', function(){
		@Component({ selector : 'my-component' })
		class MyClass{ }

		MyClass.$component.should.have.property('restrict', 'E');
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

		caughtAttr.should.be.ok;
		caughtClass.should.be.ok;
	});

	it('should accept a binding property', function(){
		@Component({
			selector : 'my-component',
			bind : { 'myAttr' : '@' }
		})
		class MyClass{ }

		MyClass.$component.scope.should.have.property('myAttr', '@');
		MyClass.$component.bindToController.should.be.ok;
	});
});