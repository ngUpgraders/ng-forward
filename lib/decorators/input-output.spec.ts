import {sinon} from '../tests/frameworks';
import {ng} from '../tests/angular';
import {Component} from './component';
import {Input, Output} from './input-output';
import {componentStore} from '../writers';
import {quickFixture} from '../tests/utils';
import EventEmitter from '../events/event-emitter';


describe('@Input Decorator', function(){
	it('sets component inputs metadata', function(){
		@Component({ selector: 'foo', template: 'x' })
		class Foo{
			@Input() bar;
			@Input() baz;
		}

		componentStore.get('inputMap', Foo).should.eql({
			bar: 'bar',
			baz: 'baz'
		});
	});

	it('allows renaming of public input', function(){
		@Component({ selector: 'foo', template: 'x' })
		class Foo{
			@Input('barPublic') bar;
			@Input() baz;
		}

		componentStore.get('inputMap', Foo).should.eql({
			bar: 'barPublic',
			baz: 'baz'
		});
	});

	it('merges annotated inputs with regular inputs; regular takes precedence', function(){
		@Component({ selector: 'foo', template: 'x',
			inputs: ['quux', 'bar:barPublic1']
		})
		class Foo{
			@Input('barPublic2') bar;
			@Input() baz;
		}

		componentStore.get('inputMap', Foo).should.eql({
			bar: 'barPublic1',
			baz: 'baz',
			quux: 'quux'
		});
	});

	describe('Angular Integration', () => {
		let fixture, fixtureEl;

		beforeEach(() => {
			ng.useReal();
			this.clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			this.clock.restore();
		});

		it.only('allows inputs to be access in constructor', () => {
			@Component({ selector: 'foo', template: '{{foo.myBar}}' })
			class MyClass{
				@Input('fooBar') bar;
				private myBar;

				constructor() {
					this.myBar = this.bar;
				}
			}

			fixture = quickFixture({
				directives: [MyClass],
				template: `<foo boo-bar="1"></foo>`
			});

			fixture.debugElement.text().should.eql('1');
		});

		it('adds each input as an allowed attribute on the element', () => {
			@Component({ selector: 'foo', template: '{{foo.bar}} {{foo.baz}}' })
			class MyClass{
				@Input() bar;
				@Input() baz;
			}

			fixture = quickFixture({
				directives: [MyClass],
				template: `<foo bar="1" baz="2"></foo>`
			});

			fixture.debugElement.text().should.eql('1 2');
		});

		it('disallows setting instance properties not marked as an input', () => {
			@Component({ selector: 'foo', template: '{{foo.bar}} {{foo.baz}}' })
			class MyClass{
				bar = 'false';
				@Input() baz = 'false';
			}

			fixture = quickFixture({
				directives: [MyClass],
				template: `<foo bar="true" baz="true"></foo>`
			});

			fixture.debugElement.text().should.eql('false true');
		});

		it('allows setting inputs to default values', () => {
			@Component({ selector: 'foo', template: '{{foo.foo}}' })
			class MyClass{
				@Input() foo = 'bar';
			}

			fixture = quickFixture({
				directives: [MyClass],
				template: `<foo></foo>`
			});

			fixture.debugElement.text().should.eql('bar');
		});

		it('one way binds a string to inputs with the regular syntax', () => {
			@Component({
				selector: 'child',
				template: '{{child.foo}}'
			})
			class Child {
				@Input() foo;
			}

			@Component({
				selector: 'parent',
				directives: [Child],
				template: `
					<child foo="Hello"></child>
				`
			})
			class Parent {}

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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
				template: '{{child.foo}}'
			})
			class Child {
				@Input() foo;
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

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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
				template: '{{child.foo}}'
			})
			class Child {
				@Input() foo;
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

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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
				template: '{{child.foo}} {{child.baz}}'
			})
			class Child {
				@Input() foo;
				@Input() baz;
				private _foo;

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

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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
				template: '{{child.foo}} {{child.baz}}'
			})
			class Child {
				@Input() foo;
				@Input() baz;
				private _foo;

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

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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
				template: '{{child.foo}} {{child.baz}}'
			})
			class Child {
				@Input() foo;
				@Input() baz;
				private _foo;

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

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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
				outputs: ['fooChanged'],
				template: '{{child.foo}}'
			})
			class Child {
				@Input() foo;
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

			fixture = quickFixture({
				directives: [Parent],
				template: `<parent></parent>`
			});

			fixtureEl = fixture.debugElement;
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

		describe('binding to scope or bindToController based on angular version', () => {
			const quickBuildBindingTest = () => {
				@Component({ selector: 'foo', template: '{{foo.bar}}' })
				class MyClass{
					@Input() bar;
				}

				fixture = quickFixture({
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
});


describe('@Output Decorator', function(){
	it('sets component outputs metadata', function(){
		@Component({ selector: 'foo', template: 'x' })
		class Foo{
			@Output() bar;
			@Output() baz;
		}

		componentStore.get('outputMap', Foo).should.eql({
			bar: 'bar',
			baz: 'baz'
		});
	});

	it('allows renaming of public input', function(){
		@Component({ selector: 'foo', template: 'x' })
		class Foo{
			@Output('barPublic') bar;
			@Output() baz;
		}

		componentStore.get('outputMap', Foo).should.eql({
			bar: 'barPublic',
			baz: 'baz'
		});
	});

	it('merges annotated outputs with regular outputs; regular takes precedence', function(){
		@Component({ selector: 'foo', template: 'x',
			outputs: ['quux', 'bar:barPublic1']
		})
		class Foo{
			@Output('barPublic2') bar;
			@Output() baz;
		}

		componentStore.get('outputMap', Foo).should.eql({
			bar: 'barPublic1',
			baz: 'baz',
			quux: 'quux'
		});
	});


	describe('Angular Integration', () => {
		let fixture, fixtureEl;

		beforeEach(() => {
			ng.useReal();
			this.clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			this.clock.restore();
		});

		it('creates a directive per output', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() change;
				@Output() otherChange;
			}

			let fixture = quickFixture({
				directives: [Foo]
			});

			fixture.debugElement.getLocal('(change)Directive')[0].restrict.should.eql('A');
			fixture.debugElement.getLocal('(otherChange)Directive')[0].restrict.should.eql('A');

			fixture.debugElement.getLocal('(change)Directive')[0].name.should.eql('(change)');
			fixture.debugElement.getLocal('(otherChange)Directive')[0].name.should.eql('(otherChange)');
		});

		it('creates a directive triggered by dom event', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() output
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output)="test.bar=true"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			fixture.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('output'));
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.be.true;
		});

		it('creates a dasherized directive triggered by dom event', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() outputChange;
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output-change)="test.bar=true"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			fixture.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('outputChange'));
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.be.true;
		});

		it('passes along event detail via dom event', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() output;
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output)="test.bar=$event.detail"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			let detail = 'hello';

			fixture.debugElement.componentViewChildren[0].nativeElement.dispatchEvent(new CustomEvent('output', {detail}));
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.eql('hello');
		});

		it('creates a directive triggered by event emitter', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() output = new EventEmitter();
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output)="test.bar=true"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			fixture.debugElement.componentViewChildren[0].componentInstance.output.next();
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.be.true;
		});

		it('creates a dasherized directive triggered by event emitter', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() outputChange = new EventEmitter();
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output-change)="test.bar=true"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			fixture.debugElement.componentViewChildren[0].componentInstance.outputChange.next();
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.be.true;
		});

		it('passes along event detail via event emitter', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output() output = new EventEmitter();
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output)="test.bar=$event.detail"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			let detail = 'hello';

			fixture.debugElement.componentViewChildren[0].componentInstance.output.next(detail);
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.eql('hello');
		});

		it('creates a directive triggered by local named event emitter', () => {
			@Component({ selector: 'foo', template: 'x' })
			class Foo {
				@Output('output') o = new EventEmitter();
			}

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (output)="test.bar=true"></foo>`
			});

			fixture.debugElement.componentInstance.bar.should.be.false;

			fixture.debugElement.componentViewChildren[0].componentInstance.o.next();
			this.clock.tick();

			fixture.debugElement.componentInstance.bar.should.be.true;
		});

		xit('bubbles events if they are dispatched  with bubbles set to true', () => {
			@Component({ selector: 'bar', template: 'x' })
			class Bar {
				@Output() barChange;
			}

			@Component({
				selector: 'foo',
				directives: [Bar],
				template: `<bar ng-init="foo.bar=false" (bar-change)="foo.bar=true"></bar>`
			})
			class Foo { }

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (bar-change)="test.bar=true"></foo>`
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
			@Component({ selector: 'bar', template: 'x' })
			class Bar {
				@Output() barChange = new EventEmitter();
			}

			@Component({
				selector: 'foo',
				directives: [Bar],
				template: `<bar ng-init="foo.bar=false" (bar-change)="foo.bar=true"></bar>`
			})
			class Foo { }

			let fixture = quickFixture({
				directives: [Foo],
				template: `<foo ng-init="test.bar=false" (bar-change)="test.bar=true"></foo>`
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