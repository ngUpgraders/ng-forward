/*global describe,it */
import '../tests/frameworks';
import { providerWriter } from '../writers';
import { Provider, provide } from './provider';
import { ng } from '../tests/angular';
import Module from '../module';
import bootstrap from '../bootstrap';
import { Inject } from '../decorators/inject';
import { Component } from '../decorators/providers/component';
import { TestComponentBuilder, providers } from '../tests';
import { OpaqueToken } from '../classes/opaque-token';

class SomeToken {}

describe('Provider Class', () => {
  let someValue;
  const someConst = 'const';

  beforeEach(() => {
    providerWriter.set('type', 'whatever', SomeToken);
    providerWriter.set('name', 'someToken', SomeToken);
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
    () => new Provider().should.throw;
  });

  it('throws No usage provided if no use method is provided', () => {
    () => new Provider('foo').should.throw;
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
});

describe('provide method', () => {
  it('aliases to new Provider() call', () => {
    var p = provide('bar', { useValue: 'val' });
    p.should.be.an.instanceOf(Provider);
    p.token.should.be.equal('bar');
    p.useValue.should.be.equal('val');
  })
});

describe('angular integration', () => {
  let tcb;
  let angular;
  let root;

  @Component({ selector: 'testComponent', template: '<div' })
  class Test {}

  const buildRootTestWithProvider = p => {
    root = tcb
        .overrideProviders(Test, [p])
        .create(Test);
  };

  beforeEach(() => {
    tcb = new TestComponentBuilder();
    angular = ng.useReal();
  });

  describe('Provider\'s "use" Methods', () => {

    it('creates an angular value with useVal', () => {
      buildRootTestWithProvider(new Provider('foo', { useValue: 'bar' }));

      root.debugElement.getLocal('foo').should.eql('bar');
    });

    it('creates an angular constant with useConstant', () => {
      buildRootTestWithProvider(new Provider('foo', { useConstant: 'bar' }));

      root.debugElement.getLocal('foo').should.be.eql('bar');
    });

    it('creates an angular service with useClass', () => {
      class Bar {
        constructor() {
          this.property = 'bar';
        }
        method() {
          return 'baz';
        }
      }
      buildRootTestWithProvider(new Provider('foo', { useClass: Bar }));

      let foo = root.debugElement.getLocal('foo');
      foo.should.be.an.instanceOf(Bar);
      foo.property.should.be.eql('bar');
      foo.method().should.be.eql('baz');
    });

    it('creates an injected angular service with useClass', () => {
      @Inject('$q')
      class Bar {
        constructor($q) {
          this.$q = $q;
        }
      }
      buildRootTestWithProvider(new Provider('foo', { useClass: Bar }));

      let foo = root.debugElement.getLocal('foo');
      foo.should.be.an.instanceOf(Bar);
      foo.$q.should.be.eql(root.debugElement.getLocal('$q'));
      foo.$q.should.have.property('resolve');
    });

    it('creates an angular factory from a function with useFactory', () => {
      function getBar() {
        return 'bar';
      }

      buildRootTestWithProvider(new Provider('foo', { useFactory: getBar }));

      root.debugElement.getLocal('foo').should.eql('bar');
    });

    it('creates an angular factory with ng1 dependencies from a function with useFactory', () => {
      function getQ($q) {
        return $q;
      }

      buildRootTestWithProvider(new Provider('foo', { useFactory: getQ, deps: ['$q'] }));

      root.debugElement.getLocal('foo').should.eql(root.debugElement.getLocal('$q'));
    });

    it.skip('creates an angular factory with class dependencies from a function with useFactory', () => {
      class Foo {
        constructor() {
          this.bar = 'bar';
        }
      }

      function getBar(foo) {
        return foo.bar;
      }

      buildRootTestWithProvider(new Provider('foo', { useFactory: getBar, deps: [Foo] }));
      let name = providerWriter.get('name', Foo);

      root.debugElement.getLocal(name).should.eql('bar');
    });
  });

  describe('Provider Tokens', () => {

    it('supports string tokens', () => {
      buildRootTestWithProvider(new Provider('foo', { useValue: 'bar' }));

      root.debugElement.getLocal('foo').should.eql('bar');
    });

    it('supports OpaqueToken tokens', () => {
      let t = new OpaqueToken('foo');
      buildRootTestWithProvider(new Provider(t, { useValue: 'bar' }));

      root.debugElement.getLocal(t).should.eql('bar');
    });

    it('supports class tokens', () => {
      class Foo {}
      buildRootTestWithProvider(new Provider(Foo, { useValue: 'bar' }));
      let name = providerWriter.get('name', Foo);
      root.debugElement.getLocal(name).should.be.eql('bar');
    });
  });
});
