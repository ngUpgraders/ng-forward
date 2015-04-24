import {Inject} from './inject';
import chai from '../util/tests';

describe('@Inject annotation', function(){
	it('should decorate a function with the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		MyClass.should.have.property('$inject');
	});

	it('should add injected dependencies to the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		MyClass.$inject.should.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		@Inject('d', 'e', 'f')
		class SubClass extends MyClass{ }

		MyClass.$inject.should.eql(['a', 'b', 'c']);
		SubClass.$inject.should.eql(['a', 'b', 'c', 'd', 'e', 'f']);
	});
});