import {Require} from './require';
import {componentWriter} from '../../writers';
import {expect} from '../../util/tests';

describe('@Require Component Decorator', function(){
	it('should add the require DDO key to the target', function(){
		@Require()
		class MyClass{ }

		componentWriter.has('require', MyClass).should.be.ok;
	});

	it('should set an array of requires as the value for the require key', function(){
		@Require('a', 'b')
		class MyClass{ }

		Array.isArray(componentWriter.get('require', MyClass)).should.be.ok;
		componentWriter.get('require', MyClass).should.eql(['a', 'b']);
	});

	it('should respect inheritance', function(){
		@Require('a')
		class Parent{ }

		@Require('b')
		class Child extends Parent{ }

		componentWriter.get('require', Child).should.eql(['a', 'b']);
	});
});