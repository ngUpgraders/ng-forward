import {Inject} from './inject';
import {expect} from 'chai';

describe('@Inject annotation', function(){
	it('should decorate a function with the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		expect(MyClass).to.have.property('$inject');
	});

	it('should add injected dependencies to the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		expect(MyClass.$inject).to.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		@Inject('d', 'e', 'f')
		class SubClass extends MyClass{ }

		expect(SubClass.$inject).to.eql(['a', 'b', 'c', 'd', 'e', 'f']);
	});
});