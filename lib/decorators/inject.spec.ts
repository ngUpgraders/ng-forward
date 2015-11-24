/* global describe, it */
import {Inject} from './inject';
import {Injectable} from './injectable';
import {bundleStore} from '../writers';
import {expect} from '../tests/frameworks';
import {provide} from '../classes/provider';

describe('@Inject annotation', function(){
	it('should decorate a function with the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		bundleStore.has('$inject', MyClass).should.be.ok;
	});

	it('should add injected dependencies to the $inject array', function(){
		@Inject('a', 'b', 'c')
		class MyClass{ }

		bundleStore.get('$inject', MyClass).should.eql(['a', 'b', 'c']);
	});

	it('should add injected dependencies to static methods', function(){
		class MyClass{
			@Inject('a', 'b', 'c')
			static foo(){}
		}

		bundleStore.get('$inject', MyClass.foo).should.eql(['a', 'b', 'c']);
	});

	it('should throw an error if injecting an invalid provider', function(){
		@Injectable class ValidClass {}
		let validNg1Service = '$q';
		let validProvider = provide('foo', {useValue: 'foo'});
		class NotValidClass {}

		expect(() => {
			@Inject(validNg1Service, ValidClass, validProvider)
			class A{}
		}).to.not.throw(Error);

		expect(() => {
			@Inject(validNg1Service, ValidClass, validProvider, NotValidClass)
			class A{}
		}).to.throw(/Processing "A" @Inject parameter: "NotValidClass" is not a valid injectable/);
	});
});
