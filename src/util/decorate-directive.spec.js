/*global describe,it,beforeEach */
import decorateDirective from './decorate-directive';
import Module from '../module';
import {componentWriter} from '../writers';
import {sinon} from '../tests/frameworks';

xdescribe('Directive Decorator', function(){
	class Example{ }

	it('should let you bind attributes to the controller using a properties array like Angular 2', function(){
		decorateDirective({
			properties: [
				'someProp',
				'anotherProp'
			]
		}, Example);

		componentWriter.get('properties', Example).should.eql({
			'someProp': 'someProp',
			'anotherProp': 'anotherProp'
		});
	});

	it('should throw an error if you do not pass an array to the properties field', function(){
		let dec = (val) => () => decorateDirective({
			properties: val
		}, Example);

		dec('string').should.throw(TypeError);
		dec({}).should.throw(TypeError);
		dec(false).should.throw(TypeError);
		dec(null).should.throw(TypeError);
		dec(undefined).should.not.throw(TypeError);
	});

	it('should set the controllerAs field if provided', function(){
		decorateDirective({ controllerAs: 'hi' }, Example);

		componentWriter.get('controllerAs', Example).should.eql('hi');
	});

	afterEach(function(){
		componentWriter.clear(Example);
	});

	describe('Directive Parser', function(){
		let parser, ngModule;

		beforeEach(function(){
			parser = Module.getParser('directive');
			ngModule = { directive: sinon.spy() };
		});

		it('should be defined', function(){
			parser.should.be.defined;
		});

		it('should correctly generate a simple DDO', function(){
			class Test{ }
			decorateDirective({}, Test);

			parser(Test, 'testSelector', [], ngModule);

			let [name, factory] = ngModule.directive.args[0];

			name.should.eql('testSelector');
			(typeof factory).should.eql('function');
			factory().should.eql({
				controller: [Test]
			});
		});

		it('should generate a complex DDO', function(){
			class AnotherTest{
				static link(){ }
				static compile(){ }
			}

			decorateDirective({
				properties: [
					'attr',
					'prop'
				]
			}, AnotherTest);

			parser(AnotherTest, 'testSelector', ['$q', '$timeout'], ngModule);

			let [name, factory] = ngModule.directive.args[0];

			factory().should.eql({
				properties: {
					attr: 'attr',
					prop: 'prop'
				},
				controller: ['$q', '$timeout', AnotherTest],
				link: AnotherTest.link,
				compile: AnotherTest.compile
			});
		});

		it('should respect properties inheritance during parsing', function(){
			class Parent{ }

			decorateDirective({
				properties: [
					'first',
					'second'
				]
			}, Parent);

			class Child extends Parent{ }

			decorateDirective({
				properties: [
					'second',
					'third',
					'fourth: renamed'
				]
			}, Child);

			parser(Child, 'childSelector', [], ngModule);

			let [name, factory] = ngModule.directive.args[0];

			factory().should.eql({
				properties: {
					first: 'first',
					second: 'second',
					third: 'third',
					fourth: 'renamed'
				},
				controller: [Child]
			});
		});
	});
});
