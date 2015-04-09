import {expect} from 'chai';
import {decorateDirective} from './decorate-directive';
import {Module} from '../module/module';
import sinon from 'sinon';
import extend from 'extend';

const Decorate = (name, type, binder) => t => {
	decorateDirective(t, name, type, binder);
}

describe('Directive decorator', function(){
	it('should decorate a target with the given name and type', function(){
		class Example{ }

		decorateDirective(Example, 'test', 'E');

		expect(Example).to.have.property('$component');
		expect(Example).to.have.property('$provider');
		expect(Example.$provider.name).to.equal('test');
		expect(Example.$provider.type).to.equal('directive');
		expect(Example.$component.restrict).to.equal('E');
	});

	it('should attach a scope binding expression if a binder is provided', function(){
		class Example{ }

		decorateDirective(Example, 'test', 'E', { 'myAttr' : '=' });

		expect(Example.$component).to.have.property('scope');
		expect(Example.$component.scope).to.have.property('myAttr', '=');
	});

	it('should set bindToController:true; if a binder is provided', function(){
		class Example{ }

		decorateDirective(Example, 'test', 'E', { 'myAttr' : '=' });

		expect(Example.$component).to.have.property('bindToController', true);
	});

	it('should merge binders if used on a subclass', function(){
		class Example{ }
		decorateDirective(Example, 'test', 'E', { 'myAttr' : '=' });

		class NewExample extends Example{ }
		decorateDirective(NewExample, 'test', 'A', { 'newAttr' : '&' });

		expect(Example.$component.scope).to.eql({
			myAttr : '='
		});

		expect(NewExample.$component.scope).to.eql({
			myAttr : '=',
			newAttr : '&'
		});
	});

	it('should respect inheritance', function(){
		@Decorate('baseComponent', 'E')
		class BaseComponent{ }

		@Decorate('newComponent', 'E')
		class NewComponent extends BaseComponent{ }

		expect(BaseComponent.$provider.name).to.equal('baseComponent');
	});

	describe('parser', function(){
		it('should be registered with Module', function(){
			let parser = Module.getParser('directive');

			expect(parser).to.be.defined;
		});
		
		it('should register a directive on a module', function(){
			let parser = Module.getParser('directive');
			let module = {
				directive : sinon.spy()
			};

			class MyComponent{
				static link(){

				}

				static compile(){

				}
			}
			decorateDirective(MyComponent, 'myComponent', 'E', { 'myAttr' : '=' });

			parser(MyComponent, module);

			let name = module.directive.args[0][0];
			let provider = module.directive.args[0][1];
			let directive = provider();
			let controller = directive.controller;
			delete controller.$component;

			expect(name).to.equal('myComponent');
			expect(directive).to.eql({
				restrict : 'E',
				bindToController : true,
				scope : { 'myAttr' : '=' },
				link : MyComponent.link,
				controller : controller,
				compile : MyComponent.compile,
				controllerAs: 'MyComponent'
			});
		});
	});
});