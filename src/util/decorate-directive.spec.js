import {decorateDirective} from './decorate-directive';
import {Module} from '../module/module';
import {sinon} from './tests'

const Decorate = (name, type, binder) => t => {
	decorateDirective(t, name, type, binder);
}

describe('Directive decorator', function(){
	it('should decorate a target with the given name and type', function(){
		class Example{ }

		decorateDirective(Example, 'test', 'E');

		Example.should.have.property('$component');
		Example.should.have.property('$provider');
		Example.$provider.name.should.equal('test');
		Example.$provider.type.should.equal('directive');
		Example.$component.restrict.should.equal('E');
	});

	it('should attach a scope binding expression if a binder is provided', function(){
		class Example{ }

		decorateDirective(Example, 'test', 'E', { 'myAttr' : '=' });

		Example.$component.should.have.property('scope');
		Example.$component.scope.should.have.property('myAttr', '=');
	});

	it('should set bindToController:true; if a binder is provided', function(){
		class Example{ }

		decorateDirective(Example, 'test', 'E', { 'myAttr' : '=' });

		Example.$component.should.have.property('bindToController', true);
	});

	it('should set controllerAs parameter if provided', function(){
		class Example{ }

                decorateDirective(Example, 'test', 'E', { }, 'exampleController');

                Example.$component.should.have.property('controllerAs', 'exampleController');
	});

	it('should merge binders if used on a subclass', function(){
		class Example{ }
		decorateDirective(Example, 'test', 'E', { 'myAttr' : '=' });

		class NewExample extends Example{ }
		decorateDirective(NewExample, 'test', 'A', { 'newAttr' : '&' });

		Example.$component.scope.should.eql({
			myAttr : '='
		});

		NewExample.$component.scope.should.eql({
			myAttr : '=',
			newAttr : '&'
		});
	});

	it('should respect inheritance', function(){
		@Decorate('baseComponent', 'E')
		class BaseComponent{ }

		@Decorate('newComponent', 'E')
		class NewComponent extends BaseComponent{ }

		BaseComponent.$provider.name.should.equal('baseComponent');
	});

	describe('parser', function(){
		it('should be registered with Module', function(){
			let parser = Module.getParser('directive');

			parser.should.be.defined;
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
			decorateDirective(MyComponent, 'myComponent', 'E', { 'myAttr' : '=' }, 'MyComponentController');

			parser(MyComponent, module);

			let name = module.directive.args[0][0];
			let provider = module.directive.args[0][1];
			let directive = provider();
			let controller = directive.controller;
			delete controller.$component;

			name.should.equal('myComponent');
			directive.should.eql({
				restrict : 'E',
				bindToController : true,
				scope : { 'myAttr' : '=' },
				link : MyComponent.link,
				controller : controller,
				compile : MyComponent.compile,
				controllerAs: 'MyComponentController'
			});
		});

		it('should allow for a static link function on the class', function(){
			let parser = Module.getParser('directive');
			let module = {
				directive : sinon.spy()
			};
			let testLink = false;

			class MyComponent{
				static link(){
					testLink = true;
				}
			}

			decorateDirective(MyComponent, 'myComponent', 'E', {  });
			parser(MyComponent, module);


			let directive = module.directive.args[0][1]();

			directive.link();

			testLink.should.be.ok;
		});
	});
});
