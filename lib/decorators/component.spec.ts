import { Component, View } from './component';
import { expect, sinon } from '../tests/frameworks';
import { ng } from '../tests/angular';
import { providerStore, componentStore, bundleStore } from '../writers';
import { Provider } from '../classes/provider';
import { providers } from '../testing/providers';
import Module from '../classes/module';
import events from '../events/events';
import { quickFixture } from '../tests/utils';
import EventEmitter from '../events/event-emitter';
import CustomEvent from '../util/custom-event';

describe('@Component', function(){

	describe('Annotation', () => {
		it('should throw an error if the selector is not provided', function(){
			expect(() => {
				@Component({})
				class MyClass{ }
			}).to.throw('Component Decorator Error in "MyClass": Component selector must be provided');
		});

		it('should throw an error if the inputs, providers, directives, or outputs is not an array', function(){
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

		it('throws an error for invalid provider', () => {
			class InvalidDueToNoAnnotations {}

			expect(() => {
				@Component({ selector: 'foo', template: 'x',
					providers: [InvalidDueToNoAnnotations]
				})
				class Foo {}
			}).to.throw(/TypeError while analyzing Component 'Foo' providers/);
		});

		it('throws an error for invalid directives', () => {
			class InvalidDueToNoAnnotations {}

			expect(() => {
				@Component({ selector: 'foo', template: 'x',
					directives: [InvalidDueToNoAnnotations]
				})
				class Foo {}
			}).to.throw(/TypeError while analyzing Component 'Foo' directives/);
		});

		it('throws an error for invalid pipes', () => {
			class InvalidDueToNoAnnotations {}

			expect(() => {
				@Component({ selector: 'foo', template: 'x',
					pipes: [InvalidDueToNoAnnotations]
				})
				class Foo {}
			}).to.throw(/TypeError while analyzing Component 'Foo' pipes/);
		});

		it('should decorate a class with correct provider metadata', function(){
			@Component({ selector : 'my-component', template: 'x' })
			class MyComponentCtrl{ }

			providerStore.get('type', MyComponentCtrl).should.eql('component');
			providerStore.get('name', MyComponentCtrl).should.eql('myComponent');
		});

		it('should decorate a class with correct app metadata', function() {
			let p = new Provider('foo', {useValue: 'bar'});

			@Component({
				selector : 'my-component',
				providers: ['some-module', p],
				template: 'x'
			})
			class MyComponentCtrl{ }

			bundleStore.get('selector', MyComponentCtrl).should.eql('my-component');
			bundleStore.get('modules', MyComponentCtrl).should.eql(['some-module']);
			bundleStore.get('providers', MyComponentCtrl).should.eql([p]);
		});

		it('should decorate a class with app metadata', function() {
			let p1 = new Provider('foo', {useValue: 'bar'});
			let p2 = new Provider('baz', {useValue: 'quux'});

			@Component({
				selector : 'my-parent',
				providers: ['a-module', p1, 'b-module', p2],
				template: 'x'
			})
			class ParentCtrl{ }

			bundleStore.get('modules', ParentCtrl).should.eql(['a-module', 'b-module']);
			bundleStore.get('providers', ParentCtrl).should.eql([p1, p2]);
		});

		it('should set sensible defaults using component metadata', function(){
			@Component({ selector: 'my-component', template: 'x' })
			class MyComponentCtrl{ }

			componentStore.get('restrict', MyComponentCtrl).should.eql('E');
			componentStore.get('scope', MyComponentCtrl).should.eql({});
			componentStore.get('bindToController', MyComponentCtrl).should.be.ok;
		});

		it('should set component inputs metadata', function(){
			@Component({ selector: 'child', inputs: ['first', 'second', 'third'], template: 'x' })
			class ChildCtrl{ }

			componentStore.get('inputMap', ChildCtrl).should.eql({
				first: 'first',
				second: 'second',
				third: 'third'
			});
		});

		it('should set component outputs metadata', function(){
			@Component({ selector: 'child', outputs: ['first'], template: 'x' })
			class MyComponentCtrl{ }

			componentStore.get('outputMap', MyComponentCtrl).should.eql({
				first: 'first'
			});

			let resolvedEvents = events.resolve();
			var lastEvent = resolvedEvents[resolvedEvents.length - 1];
			providerStore.get('name', lastEvent).should.eql('(first)');
		});

		it('should set component controllerAs metadata to "ctrl" by default', function(){
			@Component({ selector: 'foo', template: 'x' })
			class MyComponentCtrl1{ }

			componentStore.get('controllerAs', MyComponentCtrl1).should.eql('ctrl');
		});

		it('should set component controllerAs metadata to camelCased selector if value is $auto', function(){
			@Component({ selector: 'foo', template: 'x', controllerAs: '$auto' })
			class MyComponentCtrl1{ }

			@Component({ selector: 'foo-bar', template: 'x', controllerAs: '$auto' })
			class MyComponentCtrl2{ }

			componentStore.get('controllerAs', MyComponentCtrl1).should.eql('foo');
			componentStore.get('controllerAs', MyComponentCtrl2).should.eql('fooBar');
		});

		it('should set component controllerAs metadata to custom', function(){
			@Component({ selector: 'foo', controllerAs: 'vm', template: 'x' })
			class MyComponentCtrl1{ }

			componentStore.get('controllerAs', MyComponentCtrl1).should.eql('vm');
		});

		it('should set component link metadata if provided', function(){
			@Component({ selector: 'foo', template: 'x' })
			class MyComponentCtrl1{ }

			@Component({ selector: 'foo', template: 'x' })
			class MyComponentCtrl2{
				static link() {}
			}

			expect(componentStore.get('link', MyComponentCtrl1)).not.to.exist;
			componentStore.get('link', MyComponentCtrl2).should.equal(MyComponentCtrl2.link);
		});

		it('should set component compile metadata if provided', function(){
			@Component({ selector: 'foo', template: 'x' })
			class MyComponentCtrl1{ }

			@Component({ selector: 'foo', template: 'x' })
			class MyComponentCtrl2{
				static compile() {}
			}

			expect(componentStore.get('compile', MyComponentCtrl1)).not.to.exist;
			componentStore.get('compile', MyComponentCtrl2).should.equal(MyComponentCtrl2.compile);
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
				quickFixture({directives: [MyClass]});
			}).not.to.throw(Error);

			expect(() => {
				@Component({ selector: '[my-attr]', template: 'x' })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).to.throw('Processing "MyClass" in "test.module": ' +
					'@Component selectors can only be elements. Perhaps you meant to use @Directive?');

			expect(() => {
				@Component({ selector: '.my-class', template: 'x' })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).to.throw('Processing "MyClass" in "test.module": ' +
					'@Component selectors can only be elements. Perhaps you meant to use @Directive?');
		});

		it('should throw an error if no template is provided', () => {
			expect(() => {
				@Component({ selector: 'my-component', template: true })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component', templateUrl: true })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component' })
				@View({ template: true })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component' })
				@View({ templateUrl: true })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).not.to.throw;

			expect(() => {
				@Component({ selector: 'my-component' })
				class MyClass{ }
				quickFixture({directives: [MyClass]});
			}).to.throw('@Component config must include either a template or a template url for component with selector my-component on MyClass');
		});

		it('creates a directive with defaults', () => {
			@Component({ selector: 'foo', template: 'x' })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = fixture.debugElement.getLocal('fooDirective')[0];
			directive.restrict.should.eql('E');
			directive.scope.should.eql({});
		});

		it('creates a directive with name from selector', () => {
			@Component({ selector: 'foo', template: 'x' })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = fixture.debugElement.getLocal('fooDirective')[0];
			directive.name.should.eql('foo');
		});

		it('creates a directive with controllerAs set to "ctrl"', () => {
			@Component({ selector: 'foo', template: 'x' })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = fixture.debugElement.getLocal('fooDirective')[0];
			directive.controllerAs.should.eql('ctrl');
		});

		it('creates a directive with controllerAs set to "$auto"', () => {
			@Component({ selector: 'foo', controllerAs: '$auto', template: 'x' })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = fixture.debugElement.getLocal('fooDirective')[0];
			directive.controllerAs.should.eql('foo');
		});

		it('creates a directive with controllerAs that is provided', () => {
			@Component({ selector: 'foo', controllerAs: 'vm', template: 'x' })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = fixture.debugElement.getLocal('fooDirective')[0];
			directive.controllerAs.should.eql('vm');
		});

		it('creates a directive with multi-word selector that is provided', () => {
			@Component({ selector: 'foo-bar', controllerAs: '$auto', template: 'x' })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			var directive = fixture.debugElement.getLocal('fooBarDirective')[0];
			directive.controllerAs.should.eql('fooBar');
		});

		it('creates a directive whose controller is an instance of the decorated class', () => {
			@Component({ selector: 'foo', template: true })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			let component = fixture.debugElement.componentViewChildren[0].componentInstance;
			component.should.be.instanceOf(MyClass);
		});

		it('creates a directive with the provided template', () => {
			@Component({ selector: 'foo', template: "foo" })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			let componentEl = fixture.debugElement.componentViewChildren[0];
			componentEl.html().should.be.eql('foo');
		});

		it('creates a directive with the provided templateUrl', () => {
			@Component({ selector: 'foo', templateUrl: "foo.html" })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			let componentEl = fixture.debugElement.componentViewChildren[0];
			componentEl.html().should.be.eql('template content');
		});

		it('creates a directive with transclusion', () => {
			@Component({ selector: 'foo', template: "** <ng-transclude></ng-transclude> **" })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo>hello</foo>`
			});

			fixture.debugElement.text().should.be.equal('** hello **');
		});

		it('creates a directive with transclusion using ng-content alias', () => {
			@Component({ selector: 'foo', template: "** <ng-content></ng-content> **" })
			class MyClass{ }

			let fixture = quickFixture({
				directives: [MyClass],
				template: `<foo>hello</foo>`
			});

			fixture.debugElement.text().should.be.equal('** hello **');
		});

		describe('inputs', () => {

			beforeEach(() => {
				this.clock = sinon.useFakeTimers();
			});

			afterEach(() => {
				this.clock.restore();
			});

			it('adds each input as an allowed attribute on the element', () => {
				@Component({ selector: 'foo', template: '{{ctrl.bar}} {{ctrl.baz}}', inputs: ['bar', 'baz'] })
				class MyClass{ }

				let fixture = quickFixture({
					directives: [MyClass],
					template: `<foo bar="1" baz="2"></foo>`
				});

				fixture.debugElement.text().should.eql('1 2');
			});

			it('disallows setting instance properties not marked as an input', () => {
				@Component({ selector: 'foo', template: '{{ctrl.bar}} {{ctrl.baz}}', inputs: ['baz'] })
				class MyClass{
					private bar = 'false';
					private baz = 'false';
				}

				let fixture = quickFixture({
					directives: [MyClass],
					template: `<foo bar="true" baz="true"></foo>`
				});

				fixture.debugElement.text().should.eql('false true');
			});

			it('allows setting inputs to default values', () => {
				@Component({ selector: 'foo', template: '{{ctrl.foo}}', inputs: ['foo'] })
				class MyClass{
					private foo = 'bar';
				}

				let fixture = quickFixture({
					directives: [MyClass],
					template: `<foo></foo>`
				});

				fixture.debugElement.text().should.eql('bar');
			});

			it('one way binds a string to inputs with the regular syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{ctrl.foo}}'
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

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let childEl = parentEl.find('child');

				childEl.text().should.eql('Hello');

				childEl.componentInstance.foo = 'Hola';
				fixture.detectChanges();

				childEl.text().should.eql('Hola');
			});

			it('one way binds to an expression to inputs with the [input] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{ctrl.foo}}'
				})
				class Child {}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{ctrl.foo}} World!</h1>
						<child [foo]="ctrl.foo"></child>
					`
				})
				class Parent { foo = "Hello"; }

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

        		parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello');

				childEl.componentInstance.foo = 'Hola';
				fixture.detectChanges();

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hola');

				parentEl.componentInstance.foo = 'Howdy';
				fixture.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy');
			});

			it('two way binds an expression to inputs with the [(input)] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{ctrl.foo}}'
				})
				class Child {}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{ctrl.foo}} World!</h1>
						<child [(foo)]="ctrl.foo"></child>
					`
				})
				class Parent {
					foo = "Hello";
				}

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello');

				childEl.componentInstance.foo = 'Hola';
				fixture.detectChanges();

				parentH1El.text().should.eql('Hola World!');
				childEl.text().should.eql('Hola');

				parentEl.componentInstance.foo = 'Howdy';
				fixture.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy');
			});

			it('one way binds a string to inputs with getter/setter with the regular syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{ctrl.foo}} {{ctrl.baz}}'
				})
				class Child {
					private _foo;
					private baz;

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

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let childEl = parentEl.find('child');

				childEl.text().should.eql('Hello Hello');

				childEl.componentInstance.foo = 'Hola';
				fixture.detectChanges();

				childEl.text().should.eql('Hola Hola');
			});

			it('one way binds to an expression to inputs with getter/setter with the [input] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{ctrl.foo}} {{ctrl.baz}}'
				})
				class Child {
					private _foo;
					private baz;

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
						<h1 class="greeting">{{ctrl.foo}} World!</h1>
						<child [foo]="ctrl.foo"></child>
					`
				})
				class Parent { foo = "Hello"; }

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

        		parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello Hello');

				childEl.componentInstance.foo = 'Hola';
				fixture.detectChanges();

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hola Hola');

				parentEl.componentInstance.foo = 'Howdy';
				fixture.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy Howdy');
			});

			it('two way binds an expression to inputs with getter/setter with the [(input)] syntax', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					template: '{{ctrl.foo}} {{ctrl.baz}}'
				})
				class Child {
					private _foo;
					private baz;

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
						<h1 class="greeting">{{ctrl.foo}} World!</h1>
						<child [(foo)]="ctrl.foo"></child>
					`
				})
				class Parent {
					foo = "Hello";
				}

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello Hello');

				childEl.componentInstance.foo = 'Hola';
				fixture.detectChanges();

				parentH1El.text().should.eql('Hola World!');
				childEl.text().should.eql('Hola Hola');

				parentEl.componentInstance.foo = 'Howdy';
				fixture.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy Howdy');
			});

			it('allows manual two way binding via a combined input and output, e.g. [input]="prop" (input-change)="prop=$event"', () => {
				@Component({
					selector: 'child',
					inputs: ['foo'],
					outputs: ['fooChanged'],
					template: '{{ctrl.foo}}'
				})
				class Child {
					private foo;
					private fooChanged = new EventEmitter();
					setAndTriggerFoo(val) {
						this.foo = val;
						this.fooChanged.next(val);
					}
				}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<h1 class="greeting">{{ctrl.foo}} World!</h1>
						<child [foo]="ctrl.foo" (foo-changed)="ctrl.fooChanged($event)"></child>
					`
				})
				class Parent {
					foo = "Hello";
					fooChanged($event) { this.foo = $event.detail; }
				}

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let parentH1El = parentEl.find('h1');
				let childEl = parentEl.find('child');

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hello');

				childEl.componentInstance.setAndTriggerFoo('Hola');
				fixture.detectChanges();

				parentH1El.text().should.eql('Hello World!');
				childEl.text().should.eql('Hola');

				this.clock.tick();
				fixture.detectChanges();

				parentH1El.text().should.eql('Hola World!');
				childEl.text().should.eql('Hola');

				parentEl.componentInstance.foo = 'Howdy';
				fixture.detectChanges();

				parentH1El.text().should.eql('Howdy World!');
				childEl.text().should.eql('Howdy');
			});

			it('does NOT initialize inputs in component constructor', () => {
				@Component({
					selector: 'child',
					template: 'x',
					inputs: ['foo']
				})
				class Child {
					private foo;
					private ctorFoo;
					constructor() {
						this.ctorFoo = this.foo;
					}
				}

				@Component({
					selector: 'parent',
					directives: [Child],
					template: `
						<child foo="bar"></child>
					`
				})
				class Parent {}

				let fixture = quickFixture({
					directives: [Parent],
					template: `<parent></parent>`
				});

				let fixtureEl = fixture.debugElement;
				let parentEl = fixtureEl.find('parent');
				let childEl = parentEl.find('child');

				childEl.componentInstance.foo.should.be.eql("bar");
				expect(childEl.componentInstance.ctorFoo).to.be.undefined;
			});

			describe('binding to scope or bindToController based on angular version', () => {
				const quickBuildBindingTest = () => {
					@Component({ selector: 'foo', template: '{{ctrl.bar}}', inputs: ['bar'] })
					class MyClass{ }

					let fixture = quickFixture({
						directives: [MyClass],
						template: `<foo bar="baz"></foo>`
					});

					fixture.debugElement.text().should.eql('baz');
					return fixture.debugElement.getLocal('fooDirective')[0];
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

				let fixture = quickFixture({
					directives: [Foo]
				});

				fixture.debugElement.getLocal('(change)Directive')[0].restrict.should.eql('A');
				fixture.debugElement.getLocal('(otherChange)Directive')[0].restrict.should.eql('A');

				fixture.debugElement.getLocal('(change)Directive')[0].name.should.eql('(change)');
				fixture.debugElement.getLocal('(otherChange)Directive')[0].name.should.eql('(otherChange)');
			});

			it('creates a directive triggered by dom event', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo { }

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output)="ctrl.bar=true"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				fixture.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('output'));
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.be.true;
			});

			it('creates a dasherized directive triggered by dom event', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['outputChange'] })
				class Foo { }

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output-change)="ctrl.bar=true"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				fixture.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('outputChange'));
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.be.true;
			});

			it('passes along event detail via dom event', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo { }

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output)="ctrl.bar=$event.detail"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				let detail = 'hello';

				fixture.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('output', {detail}));
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.eql('hello');
			});

			it('creates a directive triggered by event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo {
					output = new EventEmitter();
				}

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output)="ctrl.bar=true"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				fixture.debugElement.componentViewChildren[0].componentInstance.output.next();
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.be.true;
			});

			it('creates a dasherized directive triggered by event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['outputChange'] })
				class Foo {
					outputChange = new EventEmitter();
				}

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output-change)="ctrl.bar=true"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				fixture.debugElement.componentViewChildren[0].componentInstance.outputChange.next();
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.be.true;
			});

			it('passes along event detail via event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['output'] })
				class Foo {
					output = new EventEmitter();
				}

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output)="ctrl.bar=$event.detail"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				let detail = 'hello';

				fixture.debugElement.componentViewChildren[0].componentInstance.output.next(detail);
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.eql('hello');
			});

			it('creates a directive triggered by local named event emitter', () => {
				@Component({ selector: 'foo', template: 'x', outputs: ['o:output'] })
				class Foo {
					o = new EventEmitter();
				}

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (output)="ctrl.bar=true"></foo>`
				});

				fixture.debugElement.componentInstance.bar.should.be.false;

				fixture.debugElement.componentViewChildren[0].componentInstance.o.next();
				this.clock.tick();

				fixture.debugElement.componentInstance.bar.should.be.true;
			});

			xit('bubbles events if they are dispatched  with bubbles set to true', () => {
				@Component({ selector: 'bar', template: 'x', outputs: ['barChange'] })
				class Bar { }

				@Component({
					selector: 'foo',
					directives: [Bar],
					template: `<bar ng-init="ctrl.bar=false" (bar-change)="ctrl.bar=true"></bar>`
				})
				class Foo { }

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (bar-change)="ctrl.bar=true"></foo>`
				});

				let fixtureEl = fixture.debugElement;
        		let fixtureComponent = fixtureEl.componentInstance;
				let fooEl = fixtureEl.componentViewChildren[0];
				let fooComponent = fooEl.componentInstance;
				let barEl = fooEl.componentViewChildren[0];
				let barComponent = barEl.componentInstance;

				fixtureComponent.bar.should.be.false;
				fooComponent.bar.should.be.false;

				barEl.nativeElement.dispatchEvent(new CustomEvent('barChange', { bubbles: true }));

				fixtureComponent.bar.should.be.true;
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
					template: `<bar ng-init="ctrl.bar=false" (bar-change)="ctrl.bar=true"></bar>`
				})
				class Foo { }

				let fixture = quickFixture({
					directives: [Foo],
					template: `<foo ng-init="ctrl.bar=false" (bar-change)="ctrl.bar=true"></foo>`
				});

				let fixtureEl = fixture.debugElement;
				let fixtureComponent = fixtureEl.componentInstance;
				let fooEl = fixtureEl.componentViewChildren[0];
				let fooComponent = fooEl.componentInstance;
				let barEl = fooEl.componentViewChildren[0];
				let barComponent = barEl.componentInstance;

				fixtureComponent.bar.should.be.false;
				fooComponent.bar.should.be.false;

				barComponent.barChange.next();
				this.clock.tick();

				fixtureComponent.bar.should.be.false;
				fooComponent.bar.should.be.true;
			});
		});
	});
});
