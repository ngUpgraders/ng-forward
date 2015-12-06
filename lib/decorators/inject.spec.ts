/* global describe, it */
import {Inject} from './inject';
import {Component} from './component';
import {Injectable} from './injectable';
import {bundleStore} from '../writers';
import {expect} from '../tests/frameworks';
import {provide} from '../classes/provider'
import {quickFixture} from '../tests/utils';;

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

	it('should inject requested parent components when using transclusion', () => {
		@Component({
			selector: 'parent',
			template: `<ng-transclude></ng-transclude>`
		})
		class Parent {}

		@Component({ selector: 'child', template: 'x' })
		@Inject(Parent)
		class Child {
			parentCtrl: Parent;
			constructor(p) {
				this.parentCtrl = p;
			}
		}

		let fixture = quickFixture({
			directives: [Parent, Child],
			template: `<parent><child></child></parent>`
		});

		let fixtureEl = fixture.debugElement;
		let fixtureComponent = fixtureEl.componentInstance;
		let parentEl = fixtureEl.componentViewChildren[0];
		let parentComponent = parentEl.componentInstance;
		let childEl = parentEl.componentViewChildren[0].componentViewChildren[0];
		let childComponent = childEl.componentInstance;

		childComponent.parentCtrl.should.be.equal(parentComponent);
	});

	it('should throw the default $injector error when no matching parent was found', () => {
		expect(() => {
			@Component({
				selector: 'parent',
				template: `<ng-transclude></ng-transclude>`
			})
			class Parent {}

			@Component({ selector: 'child', template: 'x' })
			@Inject(Parent)
			class Child {
				parentCtrl: Parent;
				constructor(p) {
					this.parentCtrl = p;
				}
			}

			let fixture = quickFixture({
				directives: [Parent, Child],
				template: `<child></child>`
			});
		}).to.throw(/Unknown provider: parentProvider <- parent/);
	});
});
