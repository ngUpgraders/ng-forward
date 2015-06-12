import {Inject} from './inject';
// import {hasMeta, getMeta} from '../util/metadata';
import chai from '../util/tests';

xdescribe('@Inject annotation', function(){
	it('should decorate a function with the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		hasMeta('$inject', MyClass).should.be.ok;
	});

	it('should add injected dependencies to the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		getMeta('$inject', MyClass).should.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		@Inject('d', 'e', 'f')
		class SubClass extends MyClass{ }

		getMeta('$inject', MyClass).should.eql(['a', 'b', 'c']);
		getMeta('$inject', SubClass).should.eql(['a', 'b', 'c', 'd', 'e', 'f']);
	});
});