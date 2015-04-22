import {Transclude} from './transclude';
import {expect} from 'chai';

describe('@Transclude annotation', function(){
	it('should decorate a function with the $component object', function(){
		@Transclude
		class MyComponent{ }

		expect(MyComponent).to.have.property('$component');
	});

	it('should set transclude to true on the $component', function(){
		@Transclude
		class MyClass{ }

		expect(MyClass.$component.transclude).to.be.ok;
	});

	it('should set transclude to a string if a string was provided to the annotation', function(){
		@Transclude('element')
		class MyComponent{}

		expect(MyComponent.$component.transclude).to.eql('element');
	});
});