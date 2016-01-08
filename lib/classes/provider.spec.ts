import {expect} from '../tests/frameworks';
import { providerStore } from '../writers';
import { Provider, provide } from './provider';
import { ng } from '../tests/angular';
import Module from './module';
import bootstrap from '../bootstrap';
import { Inject } from '../decorators/inject';
import { Injectable } from '../decorators/injectable';
import { Component } from '../decorators/component';
import { TestComponentBuilder, providers } from '../testing/index';
import { OpaqueToken } from '../classes/opaque-token';
import { quickFixture } from '../tests/utils';
import {By} from "../util/jqlite-extensions";

class SomeToken {}

describe('Provider Class', () => {
  let someValue;
  const someConst = 'const';

  beforeEach(() => {
    providerStore.set('type', 'whatever', SomeToken);
    providerStore.set('name', 'someToken', SomeToken);
    someValue = 'val';
  });

  it('binds a decorated service token', () => {
    let b = new Provider(SomeToken, {useValue:true});
    b.token.should.equal('someToken');
  });

  it('binds a string-based service token', () => {
    let b = new Provider('$http', {useValue:true});
    b.token.should.equal('$http');
  });

  it('throws Invalid token if no token provided', () => {
    //noinspection TypeScriptValidateTypes
    () => new Provider().should.throw;
  });

  it('throws No usage provided if no use method is provided', () => {
    //noinspection TypeScriptValidateTypes
    () => new Provider('foo').should.throw;
  });

  it('throws invalid deps if providing an uninjectable type', () => {
    class InvalidDueToNoAnnotations {}

    expect(() => {
      new Provider('foo', {
        useFactory: invalid => invalid,
        deps: [InvalidDueToNoAnnotations]
      });
    }).to.throw(/Processing "useFactory" @Inject parameter: "InvalidDueToNoAnnotations" is not a valid injectable/);
  });

  it('binds to a value', () => {
    let b = new Provider(SomeToken, { useValue: someValue });
    b.useValue.should.equal('val');
  });

  it('binds to a constant', () => {
    let b = new Provider(SomeToken, { useConstant: someConst });
    b.useConstant.should.equal('const');
  });

  it('binds to a class', () => {
    let b = new Provider(SomeToken, { useClass: SomeToken });
    b.useClass.should.equal(SomeToken);
  });

  it('binds to a factory', () => {
    let b = new Provider(SomeToken, { useFactory: () => { return 'hi' } });
    b.useFactory().should.equal('hi');
  });

  describe('Angular Integration', () => {
    let fixture;

    describe('Provider\'s "use" Methods', () => {

      it('creates an angular value with useVal', () => {
        fixture = quickFixture({ providers: [new Provider('foo', { useValue: 'bar' })] });

        fixture.debugElement.getLocal('foo').should.eql('bar');
      });

      it('creates an angular constant with useConstant', () => {
        fixture = quickFixture({ providers: [new Provider('foo', { useConstant: 'bar' })] });

        fixture.debugElement.getLocal('foo').should.be.eql('bar');
      });

      it('creates an angular service with useClass', () => {
        class Bar {
          private property = 'bar';
          method() {
            return 'baz';
          }
        }
        fixture = quickFixture({ providers: [new Provider('foo', { useClass: Bar })] });

        let foo = fixture.debugElement.getLocal('foo');
        foo.should.be.an.instanceOf(Bar);
        foo.property.should.be.eql('bar');
        foo.method().should.be.eql('baz');
      });

      it('creates an injected angular service with useClass', () => {
        @Inject('$q')
        class Bar {
          constructor(private $q) { }
        }

        fixture = quickFixture({ providers: [new Provider('foo', { useClass: Bar })] });

        let foo = fixture.debugElement.getLocal('foo');
        foo.should.be.an.instanceOf(Bar);
        foo.$q.should.be.eql(fixture.debugElement.getLocal('$q'));
        foo.$q.should.have.property('resolve');
      });

      it('creates an angular factory from a function with useFactory', () => {
        function getBar() {
          return 'bar';
        }

        fixture = quickFixture({ providers: [new Provider('foo', { useFactory: getBar })] });

        fixture.debugElement.getLocal('foo').should.eql('bar');
      });

      it('creates an angular factory with ng1 dependencies from a function with useFactory', () => {
        function getQ($q) {
          return $q;
        }

        fixture = quickFixture({ providers: [new Provider('foo', {
          useFactory: getQ,
          deps: ['$q']
        })] });

        fixture.debugElement.getLocal('foo').should.eql(fixture.debugElement.getLocal('$q'));
      });

      it('creates an angular factory with class dependencies from a function with useFactory', () => {
        @Injectable()
        class Foo {
          constructor(private bar = 'bar') {}
        }

        function getBar(foo) {
          return foo.bar;
        }

        fixture = quickFixture({ providers: [new Provider('foo', {
          useFactory: getBar,
          deps: [Foo]
        })] });

        fixture.debugElement.getLocal('foo').should.eql('bar');
      });

      it('creates an angular factory with deep class dependencies from a function with useFactory', () => {
        @Injectable()
        class Baz {
          constructor(private quux = 'quux') {}
        }

        @Injectable()
        @Inject(Baz)
        class Bar {
          constructor(private baz) {}
        }

        @Injectable()
        @Inject(Bar)
        class Foo {
          constructor(private bar) {}
        }

        function getQuux(foo) {
          return foo.bar.baz.quux;
        }

        fixture = quickFixture({ providers: [new Provider('getQuux', {
          useFactory: getQuux,
          deps: [Foo]
        })] });

        fixture.debugElement.getLocal('getQuux').should.eql('quux');
      });
    });

    describe('Provider Tokens', () => {

      it('supports string tokens', () => {
        fixture = quickFixture({ providers: [new Provider('foo', { useValue: 'bar' })] });

        fixture.debugElement.getLocal('foo').should.eql('bar');
      });

      it('supports OpaqueToken tokens', () => {
        let t = new OpaqueToken('foo');
        fixture = quickFixture({ providers: [new Provider(t, { useValue: 'bar' })] });

        fixture.debugElement.getLocal(t).should.eql('bar');
      });

      it('supports class tokens', () => {
        class Foo {}
        fixture = quickFixture({ providers: [new Provider(Foo, { useValue: 'bar' })] });
        let name = providerStore.get('name', Foo);
        fixture.debugElement.getLocal(name).should.be.eql('bar');
      });

      it('supports class tokens upon injection', () => {
        class MyClass {
          something: string;

          constructor({something} = {}) {
            this.something = something ? something : 'default';
          }
        }

        class MyClassFoo extends MyClass {
          constructor() {
            super({something: 'foo'});
          }
        }

        @Component({
          selector: 'app',
          template: `x`,
          providers: [
            provide(MyClass, {useClass: MyClassFoo})
          ]
        })
        @Inject(MyClass)
        class App{
          constructor(public myClass){}
        }

        fixture = quickFixture({ providers: [App], template: '<app></app>' });
        fixture.debugElement.query(By.directive(App)).componentInstance.myClass.something.should.eql('foo');
      });
    });
  });
});

describe('provide method', () => {
  it('aliases to new Provider() call', () => {
    var p = provide('bar', { useValue: 'val' });
    p.should.be.an.instanceOf(Provider);
    p.token.should.be.equal('bar');
    p.useValue.should.be.equal('val');
  })
});
