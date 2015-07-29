/* global describe, it */
import {Inject} from './inject';
import {appWriter} from '../writers';
import chai from '../tests/frameworks';

describe('@Inject annotation', function(){
	it('should decorate a function with the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		appWriter.has('$inject', MyClass).should.be.ok;
	});

	it('should add injected dependencies to the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		appWriter.get('$inject', MyClass).should.eql(['a', 'b', 'c']);
	});

	it('should adhere to inheritance', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		@Inject('d', 'e', 'f')
		class SubClass extends MyClass{ }

		appWriter.get('$inject', MyClass).should.eql(['a', 'b', 'c']);
		appWriter.get('$inject', SubClass).should.eql(['d', 'e', 'f', 'a', 'b', 'c']);
	});
});
