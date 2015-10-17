/* global describe, it */
import {Component} from './component';
import '../../tests/frameworks';
import {ng} from '../../tests/angular';
import {providerWriter, componentWriter, appWriter} from '../../writers';
import {Provider} from '../../classes/provider';
import events from '../../util/events';
import Module from '../../module';

describe('@Component annotation', function(){

	it('should throw an error if the selector is not provided', function(){
		let error;

		expect(() => {
			@Component({ })
			class MyClass{ }
		}).to.throw('Component Decorator Error in "MyClass": Component selector must be provided');
	});

	it('should throw an error if the selector is not an element', function(){
		let providerParser = Module.getParser('component');
		let module = ng.module();
		module.name = "myModule";

		expect(() => {
			@Component({ selector : '[my-attr]' })
			class MyClass{ }
			providerParser(MyClass, 'my-attr', [], module);
		}).to.throw('Processing "MyClass" in "myModule": ' +
								'@Component selectors can only be elements. Perhaps you meant to use @Directive?');

		expect(() => {
			@Component({ selector : '.my-class' })
			class MyClass{ }
			providerParser(MyClass, undefined, [], module);
		}).to.throw('Processing "MyClass" in "myModule": ' +
								'@Component selectors can only be elements. Perhaps you meant to use @Directive?');
	});

	it('should throw an error if the inputs, providers, directives, or outputs is not an array', function(){
		let providerParser = Module.getParser('component');
		let module = ng.module();
		module.name = "myModule";

		expect(() => {
			@Component({ selector: 'my-component', inputs: {} })
			class MyClass{ }
		}).to.throw('Component Decorator Error in "MyClass": Component inputs must be an array');

		expect(() => {
			@Component({ selector: 'my-component', providers: {} })
			class MyClass{ }
		}).to.throw('Component Decorator Error in "MyClass": Component providers must be an array');

		expect(() => {
			@Component({ selector: 'my-component', directives: {} })
			class MyClass{ }
		}).to.throw('Component Decorator Error in "MyClass": Component directives must be an array');

		expect(() => {
			@Component({ selector: 'my-component', outputs: {} })
			class MyClass{ }
		}).to.throw('Component Decorator Error in "MyClass": Component outputs must be an array');
	});

	it('should throw an error if no template is provided', function(){
		let providerParser = Module.getParser('component');
		let module = ng.module();
		module.name = "myModule";

		expect(() => {
			@Component({ selector: 'my-component', template: true })
			class MyClass{ }
			providerParser(MyClass, undefined, [], module);
		}).not.to.throw;

		expect(() => {
			@Component({ selector: 'my-component', templateUrl: true })
			class MyClass{ }
			providerParser(MyClass, undefined, [], module);
		}).not.to.throw;

		expect(() => {
			@Component({ selector: 'my-component' })
			@View({ template: true })
			class MyClass{ }
			providerParser(MyClass, undefined, [], module);
		}).not.to.throw;

		expect(() => {
			@Component({ selector: 'my-component' })
			@View({ templateUrl: true })
			class MyClass{ }
			providerParser(MyClass, undefined, [], module);
		}).not.to.throw;

		expect(() => {
			@Component({ selector: 'my-component' })
			class MyClass{ }
			providerParser(MyClass, undefined, [], module);
		}).to.throw('Processing "MyClass" in "myModule": ' +
				'Components must have a template or templateUrl via the @Component or @View decorators');
	});

	it('should decorate a class with correct provider metadata', function(){
		@Component({ selector : 'my-component' })
		class MyComponentCtrl{ }

		providerWriter.get('type', MyComponentCtrl).should.eql('component');
		providerWriter.get('name', MyComponentCtrl).should.eql('myComponent');
	});

	it('should decorate a class with correct app metadata', function() {
		let p = new Provider('foo', {useValue: 'bar'});

		@Component({
			selector : 'my-component',
			providers: ['some-module', p]
		})
		class MyComponentCtrl{ }

		appWriter.get('selector', MyComponentCtrl).should.eql('my-component');
		appWriter.get('modules', MyComponentCtrl).should.eql(['some-module']);
		appWriter.get('providers', MyComponentCtrl).should.eql([p]);
	});

	it('should decorate a class with inherited app metadata', function() {
		let p1 = new Provider('foo', {useValue: 'bar'});
		let p2 = new Provider('baz', {useValue: 'quux'});

		@Component({
			selector : 'my-parent',
			providers: ['a-module', p1]
		})
		class ParentCtrl{ }

		@Component({
			selector : 'my-child',
			providers: ['b-module', p2]
		})
		class ChildCtrl extends ParentCtrl{ }

		appWriter.get('modules', ChildCtrl).should.eql(['b-module', 'a-module']);
		appWriter.get('providers', ChildCtrl).should.eql([p2, p1]);
	});

	it('should set sensible defaults using component metadata', function(){
		@Component({ selector: 'my-component' })
		class MyComponentCtrl{ }

		componentWriter.get('restrict', MyComponentCtrl).should.eql('E');
		componentWriter.get('scope', MyComponentCtrl).should.eql({});
		componentWriter.get('bindToController', MyComponentCtrl).should.be.ok;
	});

	it('should set component inputs metadata, respecting inheritance', function(){
		@Component({
			selector: 'parent',
			inputs: [
				'first',
				'second'
			]
		})
		class ParentCtrl{ }

		@Component({ selector: 'child', inputs: ['third'] })
		class ChildCtrl extends ParentCtrl{ }

		componentWriter.get('inputMap', ChildCtrl).should.eql({
			first: 'first',
			second: 'second',
			third: 'third'
		});
	});

	it('should set component outputs metadata', function(){
		@Component({ selector: 'child', outputs: ['first'] })
		class MyComponentCtrl{ }

		componentWriter.get('outputMap', MyComponentCtrl).should.eql({
			first: 'first'
		});

		let resolvedEvents = events.resolve();
		var lastEvent = resolvedEvents[resolvedEvents.length - 1];
		providerWriter.get('name', lastEvent).should.eql('(first)');
	});

	it('should set component controllerAs metadata to camelCased selector', function(){
		@Component({ selector: 'foo' })
		class MyComponentCtrl1{ }

		@Component({ selector: 'foo-bar' })
		class MyComponentCtrl2{ }

		componentWriter.get('controllerAs', MyComponentCtrl1).should.eql('foo');
		componentWriter.get('controllerAs', MyComponentCtrl2).should.eql('fooBar');
	});

	it('should set component controllerAs metadata to custom', function(){
		@Component({ selector: 'foo', controllerAs: 'vm' })
		class MyComponentCtrl1{ }

		componentWriter.get('controllerAs', MyComponentCtrl1).should.eql('vm');
	});

	it('should set component link metadata if provided', function(){
		@Component({ selector: 'foo' })
		class MyComponentCtrl1{ }

		@Component({ selector: 'foo' })
		class MyComponentCtrl2{
			static link() {}
		}

		should.not.exist(componentWriter.get('link', MyComponentCtrl1));
		componentWriter.get('link', MyComponentCtrl2).should.equal(MyComponentCtrl2.link);
	});

	it('should set component compile metadata if provided', function(){
		@Component({ selector: 'foo' })
		class MyComponentCtrl1{ }

		@Component({ selector: 'foo' })
		class MyComponentCtrl2{
			static compile() {}
		}

		should.not.exist(componentWriter.get('compile', MyComponentCtrl1));
		componentWriter.get('compile', MyComponentCtrl2).should.equal(MyComponentCtrl2.compile);
	});
});
