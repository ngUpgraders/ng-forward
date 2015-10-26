/* global describe, it */
import { Component } from './component';
import { sinon } from '../../tests/frameworks';
import { ng } from '../../tests/angular';
import { providerWriter, componentWriter, appWriter } from '../../writers';
import { Provider } from '../../classes/provider';
import { providers } from '../../tests/providers';
import events from '../../util/events';
import Module from '../../module';
import { quickRootTestComponent } from '../../tests/internal-utils';
import { EventEmitter } from '../../util/event-emitter';

describe('@Component', function(){

	describe('Annotation', () => {
		it('should throw an error if the selector is not provided', function(){
			let error;

			expect(() => {
				@Component({ })
				class MyClass{ }
			}).to.throw('Component Decorator Error in "MyClass": Component selector must be provided');
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

	describe('Angular Integration', () => {

		let angular;

		beforeEach(() => {
			angular = ng.useReal();
		});

		beforeEach(providers(provide => {
			let $templateCache = {
				get: sinon.stub(),
				put: sinon.stub()
			};

			$templateCache.get.withArgs('foo.html').returns('template content');

			return [
					provide('$templateCache', { useValue: $templateCache })
			];
		}));

		it('should throw an error if the selector is not an element', () => {
			expect(() => {
				@Component({ selector: 'my-element', template: 'x' })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).not.to.throw(Error);

			expect(() => {
				@Component({ selector: '[my-attr]', template: 'x' })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).to.throw('Processing "MyClass" in "test.module": ' +
					'@Component selectors can only be elements. Perhaps you meant to use @Directive?');

			expect(() => {
				@Component({ selector: '.my-class', template: 'x' })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).to.throw('Processing "MyClass" in "test.module": ' +
					'@Component selectors can only be elements. Perhaps you meant to use @Directive?');
		});

		it('should throw an error if no template is provided', () => {
			expect(() => {
				@Component({ selector: 'my-component', template: true })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component', templateUrl: true })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component' })
				@View({ template: true })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component' })
				@View({ templateUrl: true })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component' })
				class MyClass{ }
				quickRootTestComponent({directives: [MyClass]});
			}).to.throw('Processing "MyClass" in "test.module": ' +
					'Components must have a template or templateUrl via the @Component or @View decorators');
		});

		it('creates a directive with defaults', () => {
			@Component({ selector: 'foo', template: 'x' })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = root.debugElement.getLocal('fooDirective')[0];
			directive.restrict.should.eql('E');
			directive.scope.should.eql({});
		});

		it('creates a directive with name from selector', () => {
			@Component({ selector: 'foo', template: 'x' })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = root.debugElement.getLocal('fooDirective')[0];
			directive.name.should.eql('foo');
		});

		it('creates a directive with controllerAs created from selector', () => {
			@Component({ selector: 'foo', template: 'x' })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = root.debugElement.getLocal('fooDirective')[0];
			directive.controllerAs.should.eql('foo');
		});

		it('creates a directive with controllerAs that is provided', () => {
			@Component({ selector: 'foo', controllerAs: 'vm', template: 'x' })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = root.debugElement.getLocal('fooDirective')[0];
			directive.controllerAs.should.eql('vm');
		});

		it('creates a directive with multi-word selector that is provided', () => {
			@Component({ selector: 'foo-bar', template: 'x' })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = root.debugElement.getLocal('fooBarDirective')[0];
			directive.controllerAs.should.eql('fooBar');
		});

		it('creates a directive whose controller is an instance of the decorated class', () => {
			@Component({ selector: 'foo', template: true })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			let component = root.debugElement.componentViewChildren[0].componentInstance;
			component.should.be.instanceOf(MyClass);
		});

		it('creates a directive with the provided template', () => {
			@Component({ selector: 'foo', template: "foo" })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			let componentEl = root.debugElement.componentViewChildren[0];
			componentEl.html().should.be.eql('foo');
		});

		it('creates a directive with the provided templateUrl', () => {
			@Component({ selector: 'foo', templateUrl: "foo.html" })
			class MyClass{ }

			let root = quickRootTestComponent({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			let componentEl = root.debugElement.componentViewChildren[0];
			componentEl.html().should.be.eql('template content');
		});

		describe('inputs', () => {

			beforeEach(() => {
				this.clock = sinon.useFakeTimers();
			});

			afterEach(() => {
				this.clock.restore();
			});

			it('adds each input as an allowed attribute on the element', () => {
				@Component({ selector: 'foo', template: '{{foo.bar}} {{foo.baz}}', inputs: ['bar', 'baz'] })
				class MyClass{ }

				let root = quickRootTestComponent({
					directives: [MyClass],
					template: `<foo bar="1" baz="2"></foo>`
				});

				root.debugElement.text().should.eql('1 2');
			});

			it('disallows setting instance properties not marked as an input', () => {
				@Component({ selector: 'foo', template: '{{foo.bar}} {{foo.baz}}', inputs: ['baz'] })
				class MyClass{
					constructor() {
						this.bar = "false";
						this.baz = "false";
					}
				}

				let root = quickRootTestComponent({
					directives: [MyClass],
					template: `<foo bar="true" baz="true"></foo>`
				});

				root.debugElement.text().should.eql('false true');
			});

			it('allows setting inputs to default values', () => {
				@Component({ selector: 'foo', template: '{{foo.foo}}', inputs: ['foo'] })
				class MyClass{
					foo = 'bar';
				}

				let root = quickRootTestComponent({
					directives: [MyClass],
					template: `<foo></foo>`
				});

				root.debugElement.text().should.eql('bar');
			});

			it('one way binds a string to inputs with the regular syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{child.foo}}'
				})
				class Child {}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<child foo="Hello"></child>
					`
				})
				class Parent {}

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let childEl = parentEl.find('child');

				childEl.text().should.eql('Hello');

				childEl.componentInstance.foo = 'Hola';
				root.detectChanges();

				childEl.text().should.eql('Hola');
			});

			it('one way binds to an expression to inputs with the [input] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{child.foo}}'
				})
				class Child {}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{parent.foo}} World!</h1>
						<child [foo]="parent.foo"></child>
					`
				})
				class Parent { foo = "Hello"; }

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

        parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello');

				childEl.componentInstance.foo = 'Hola';
				root.detectChanges();

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hola');

				parentEl.componentInstance.foo = 'Howdy';
				root.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy');
			});

			it('two way binds an expression to inputs with the [(input)] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{child.foo}}'
				})
				class Child {}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{parent.foo}} World!</h1>
						<child [(foo)]="parent.foo"></child>
					`
				})
				class Parent {
					foo = "Hello";
				}

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello');

				childEl.componentInstance.foo = 'Hola';
				root.detectChanges();

				parentH1El.text().should.eql('Hola World!');
				childEl.text().should.eql('Hola');

				parentEl.componentInstance.foo = 'Howdy';
				root.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy');
			});

			it('one way binds a string to inputs with getter/setter with the regular syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{child.foo}} {{child.baz}}'
				})
				class Child {
					set foo(val) {
						this._foo = val;
						this.baz = val;
					}
					get foo() { return this._foo; }
				}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<child foo="Hello"></child>
					`
				})
				class Parent {}

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let childEl = parentEl.find('child');

				childEl.text().should.eql('Hello Hello');

				childEl.componentInstance.foo = 'Hola';
				root.detectChanges();

				childEl.text().should.eql('Hola Hola');
			});

			it('one way binds to an expression to inputs with getter/setter with the [input] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{child.foo}} {{child.baz}}'
				})
				class Child {
					set foo(val) {
						this._foo = val;
						this.baz = val;
					}
					get foo() { return this._foo; }
				}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{parent.foo}} World!</h1>
						<child [foo]="parent.foo"></child>
					`
				})
				class Parent { foo = "Hello"; }

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

        parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello Hello');

				childEl.componentInstance.foo = 'Hola';
				root.detectChanges();

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hola Hola');

				parentEl.componentInstance.foo = 'Howdy';
				root.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy Howdy');
			});

			it('two way binds an expression to inputs with getter/setter with the [(input)] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{child.foo}} {{child.baz}}'
				})
				class Child {
					set foo(val) {
						this._foo = val;
						this.baz = val;
					}
					get foo() { return this._foo; }
				}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{parent.foo}} World!</h1>
						<child [(foo)]="parent.foo"></child>
					`
				})
				class Parent {
					foo = "Hello";
				}

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello Hello');

				childEl.componentInstance.foo = 'Hola';
				root.detectChanges();

				parentH1El.text().should.eql('Hola World!');
				childEl.text().should.eql('Hola Hola');

				parentEl.componentInstance.foo = 'Howdy';
				root.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy Howdy');
			});

			it('allows manual two way binding via a combined input and output, e.g. [input]="prop" (input-change)="prop=$event"', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					outputs: ['fooChanged'],
					template: '{{child.foo}}'
				})
				class Child {
					fooChanged = new EventEmitter();
					setAndTriggerFoo(val) {
						this.foo = val;
						this.fooChanged.next(val);
					}
				}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{parent.foo}} World!</h1>
						<child [foo]="parent.foo" (foo-changed)="parent.fooChanged($event)"></child>
					`
				})
				class Parent {
					foo = "Hello";
					fooChanged($event) { this.foo = $event.detail; }
				}

				let root = quickRootTestComponent({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let rootEl = root.debugElement;
				let parentEl = rootEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello');

				childEl.componentInstance.setAndTriggerFoo('Hola');
				root.detectChanges();

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hola');

				this.clock.tick();
				root.detectChanges();

				parentH1El.text().should.eql('Hola World!');
				childEl.text().should.eql('Hola');

				parentEl.componentInstance.foo = 'Howdy';
				root.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy');
			});

			describe('binding to scope or bindToController based on angular version', () => {
				const quickBuildBindingTest = () => {
					@Component({ selector: 'foo', template: '{{foo.bar}}', inputs: ['bar'] })
					class MyClass{ }

					let root = quickRootTestComponent({
						directives: [MyClass],
						template: `<foo bar="baz"></foo>`
					});

					root.debugElement.text().should.eql('baz');
					return root.debugElement.getLocal('fooDirective')[0];
				};

				it('creates a directive putting bindings on scope object in angular 1.3', () => {
					angular.version.minor = 3;

					let directive = quickBuildBindingTest();
					directive.scope.should.not.be.empty;
					directive.bindToController.should.be.true;
				});

				it('creates a directive putting bindings on bindToController object in angular 1.4', () => {
					angular.version.minor = 4;

					let directive = quickBuildBindingTest();
					directive.scope.should.be.empty;
					directive.bindToController.should.not.be.empty;
				});

				it('creates a directive putting bindings on bindToController object in future angular versions', () => {
					angular.version.minor = 9;

					let directive = quickBuildBindingTest();
					directive.scope.should.be.empty;
					directive.bindToController.should.not.be.empty;
				});
			});
		});

		describe('outputs', () => {
			beforeEach(() => {
				// Need to flush timeouts, event emitter .next is wrapped in a setTimeout
				this.clock = sinon.useFakeTimers();
			});

			afterEach(() => {
				this.clock.restore();
			});

			it('creates a directive per output', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['change', 'otherChange'] })
				class Foo {}

				let root = quickRootTestComponent({
					directives: [Foo]
				});

				root.debugElement.getLocal('(change)Directive')[0].restrict.should.eql('A');
				root.debugElement.getLocal('(otherChange)Directive')[0].restrict.should.eql('A');

				root.debugElement.getLocal('(change)Directive')[0].name.should.eql('(change)');
				root.debugElement.getLocal('(otherChange)Directive')[0].name.should.eql('(otherChange)');
			});

			it('creates a directive triggered by dom event', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo { }

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output)="test.bar=true"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				root.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('output'));
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.be.true;
			});

			it('creates a dasherized directive triggered by dom event', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['outputChange'] })
				class Foo { }

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output-change)="test.bar=true"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				root.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('outputChange'));
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.be.true;
			});

			it('passes along event detail via dom event', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo { }

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output)="test.bar=$event.detail"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				let detail = 'hello';

				root.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('output', {detail}));
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.eql('hello');
			});

			it('creates a directive triggered by event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo {
					output = new EventEmitter();
				}

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output)="test.bar=true"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				root.debugElement.componentViewChildren[0].componentInstance.output.next();
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.be.true;
			});

			it('creates a dasherized directive triggered by event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['outputChange'] })
				class Foo {
					outputChange = new EventEmitter();
				}

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output-change)="test.bar=true"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				root.debugElement.componentViewChildren[0].componentInstance.outputChange.next();
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.be.true;
			});

			it('passes along event detail via event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo {
					output = new EventEmitter();
				}

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output)="test.bar=$event.detail"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				let detail = 'hello';

				root.debugElement.componentViewChildren[0].componentInstance.output.next(detail);
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.eql('hello');
			});

			it('creates a directive triggered by local named event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['o:output'] })
				class Foo {
					o = new EventEmitter();
				}

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (output)="test.bar=true"></foo>`
				});

				root.debugElement.componentInstance.bar.should.be.false;

				root.debugElement.componentViewChildren[0].componentInstance.o.next();
				this.clock.tick();

				root.debugElement.componentInstance.bar.should.be.true;
			});

			it('bubbles events if they are dispatched  with bubbles set to true', () => {
				@Component({ selector: 'bar', template: 'x', outputs: ['barChange'] })
				class Bar { }

				@Component({
					selector: 'foo',
					directives: [Bar],
					template: `<bar ng-init="foo.bar=false" (bar-change)="foo.bar=true"></bar>`
				})
				class Foo { }

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (bar-change)="test.bar=true"></foo>`
				});

				let rootEl = root.debugElement;
        let rootComponent = rootEl.componentInstance;
				let fooEl = rootEl.componentViewChildren[0];
				let fooComponent = fooEl.componentInstance;
				let barEl = fooEl.componentViewChildren[0];
				let barComponent = barEl.componentInstance;

				rootComponent.bar.should.be.false;
				fooComponent.bar.should.be.false;

				barEl.nativeElement.dispatchEvent(new CustomEvent('barChange', { bubbles: true }));

				rootComponent.bar.should.be.true;
				fooComponent.bar.should.be.true;
			});

			it('does not bubble events triggered by event emitter outputs', () => {
				@Component({ selector: 'bar', template: 'x', outputs: ['barChange'] })
				class Bar {
					barChange = new EventEmitter();
				}

				@Component({
					selector: 'foo',
					directives: [Bar],
					template: `<bar ng-init="foo.bar=false" (bar-change)="foo.bar=true"></bar>`
				})
				class Foo { }

				let root = quickRootTestComponent({
					directives: [Foo],
					template: `<foo ng-init="test.bar=false" (bar-change)="test.bar=true"></foo>`
				});

				let rootEl = root.debugElement;
        let rootComponent = rootEl.componentInstance;
				let fooEl = rootEl.componentViewChildren[0];
				let fooComponent = fooEl.componentInstance;
				let barEl = fooEl.componentViewChildren[0];
				let barComponent = barEl.componentInstance;

				rootComponent.bar.should.be.false;
				fooComponent.bar.should.be.false;

				barComponent.barChange.next();
				this.clock.tick();

				rootComponent.bar.should.be.false;
				fooComponent.bar.should.be.true;
			});
		});
	});
});
