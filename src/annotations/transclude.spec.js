import {Transclude} from './transclude';
import chai from '../util/tests';

describe('@Transclude annotation', function(){
	it('should decorate a function with the $component object', function(){
		@Transclude
		class MyComponent{ }

		MyComponent.should.have.property('$component');
	});

	it('should set transclude to true on the $component', function(){
		@Transclude
		class MyClass{ }

		MyClass.$component.transclude.should.be.ok;
	});

	it('should set transclude to a string if a string was provided to the annotation', function(){
		@Transclude('element')
		class MyComponent{}

		MyComponent.$component.transclude.should.eql('element');
	});
});