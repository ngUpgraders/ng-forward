/*global describe,it */
import '../tests/frameworks';
import { providerWriter } from '../writers';
import { Provider, provide } from './provider';
import { ng } from '../tests/angular';
import Module from '../module';
import { Inject } from '../decorators/inject';

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
    let b = new Provider(SomeToken, {});
    b.token.should.equal('someToken');
  });

  it('binds a string-based service token', () => {
    let b = new Provider('$http', {});
    b.token.should.equal('$http');
  });

  it('throws Invalid token if no token provided', () => {
    () => new Provider().should.throw;
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
  let angular;
  let parser;
  let module;
  let injector;

  const bootstrapWithProvider = p => {
    parser(p, null, [], module);
    injector = angular.bootstrap(document.createElement('div'), [module.name]);
  };

  beforeEach(() => {
    angular = ng.useReal();
    parser = Module.getParser('provider');
    module = angular.module('test' + Math.random(), []);
    sinon.spy(module, 'value');
    sinon.spy(module, 'constant');
    sinon.spy(module, 'service');
    sinon.spy(module, 'factory');
  });

  describe('Providers with String Tokens', () => {

    it('creates an angular value with useVal', () => {
      bootstrapWithProvider(new Provider('foo', { useValue: 'bar' }));
      module.value.should.have.been.calledWith('foo', 'bar');
      injector.get('foo').should.be.eql('bar');
    });

    it('creates an angular constant with useConstant', () => {
      bootstrapWithProvider(new Provider('foo', { useConstant: 'bar' }));
      module.constant.should.have.been.calledWith('foo', 'bar');
      injector.get('foo').should.be.eql('bar');
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
      bootstrapWithProvider(new Provider('foo', { useClass: Bar }));
      module.service.args[0][0].should.eql('foo');
      module.service.args[0][1].should.eql([Bar]);

      let foo = injector.get('foo');
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
      bootstrapWithProvider(new Provider('foo', { useClass: Bar }));
      module.service.args[0][0].should.eql('foo');
      module.service.args[0][1].should.eql(['$q', Bar]);

      let foo = injector.get('foo');
      foo.should.be.an.instanceOf(Bar);
      foo.$q.should.be.eql(injector.get('$q'));
      foo.$q.should.have.property('resolve');
    });

    it('creates an angular factory from a function with useFactory', () => {
      function getBar() {
        return 'bar';
      }

      bootstrapWithProvider(new Provider('foo', { useFactory: getBar }));
      module.factory.args[0][0].should.eql('foo');
      module.factory.args[0][1].should.eql([getBar]);

      injector.get('foo').should.eql('bar');
    });

    it('creates an angular factory with ng1 dependencies from a function with useFactory', () => {
      function getQ($q) {
        return $q;
      }

      bootstrapWithProvider(new Provider('foo', { useFactory: getQ, deps: ['$q'] }));
      module.factory.args[0][0].should.eql('foo');
      module.factory.args[0][1].should.eql(['$q', getQ]);

      injector.get('foo').should.eql(injector.get('$q'));
    });

    it.skip('creates an angular factory with class dependencies from a function with useFactory', () => {
      function getBar(foo) {
        return foo.bar;
      }

      class Foo {
        constructor() {
          this.bar = 'bar';
        }
      }

      bootstrapWithProvider(new Provider('foo', { useFactory: getBar, deps: [Foo] }));
      let name = providerWriter.get('name', Foo);
      module.factory.args[0][0].should.eql('foo');
      module.factory.args[0][1].should.eql([name, getBar]);

      injector.get('foo').should.eql('bar');
    });
  });

  describe('Providers with Class Tokens', () => {

    let f;

    beforeEach(() => {
      f = class Foo {};
    });

    it('creates an angular value with useVal', () => {
      bootstrapWithProvider(new Provider(f, { useValue: 'bar' }));
      let name = providerWriter.get('name', f);
      module.value.should.have.been.calledWith(name, 'bar');
      injector.get(name).should.be.eql('bar');
    });

    it('creates an angular constant with useConstant', () => {
      bootstrapWithProvider(new Provider(f, { useConstant: 'bar' }));
      let name = providerWriter.get('name', f);
      module.constant.should.have.been.calledWith(name, 'bar');
      injector.get(name).should.be.eql('bar');
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

      bootstrapWithProvider(new Provider(f, { useClass: Bar }));
      let name = providerWriter.get('name', f);
      module.service.args[0][0].should.eql(name);
      module.service.args[0][1].should.eql([Bar]);

      let foo = injector.get(name);
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

      bootstrapWithProvider(new Provider(f, { useClass: Bar }));
      let name = providerWriter.get('name', f);
      module.service.args[0][0].should.eql(name);
      module.service.args[0][1].should.eql(['$q', Bar]);

      let foo = injector.get(name);
      foo.should.be.an.instanceOf(Bar);
      foo.$q.should.be.eql(injector.get('$q'));
      foo.$q.should.have.property('resolve');
    });

    it('creates an angular factory from a function with useFactory', () => {
      function getBar() {
        return 'bar';
      }

      bootstrapWithProvider(new Provider(f, { useFactory: getBar }));
      let name = providerWriter.get('name', f);
      module.factory.args[0][0].should.eql(name);
      module.factory.args[0][1].should.eql([getBar]);

      injector.get(name).should.eql('bar');
    });

    it('creates an angular factory with ng1 dependencies from a function with useFactory', () => {
      function getQ($q) {
        return $q;
      }

      bootstrapWithProvider(new Provider(f, { useFactory: getQ, deps: ['$q'] }));
      let name = providerWriter.get('name', f);
      module.factory.args[0][0].should.eql(name);
      module.factory.args[0][1].should.eql(['$q', getQ]);

      injector.get(name).should.eql(injector.get('$q'));
    });

    //it.only('creates an angular factory with class dependencies from a function with useFactory', () => {
    //  function getBar(foo) {
    //    return foo.bar;
    //  }
    //
    //  class Foo {
    //    constructor() {
    //      this.bar = 'bar';
    //    }
    //  }
    //
    //
    //  bootstrapWithProvider(new Provider(f, { useFactory: getBar, deps: [Foo] }));
    //  module.factory.args[0][0].should.eql(Foo);
    //  module.factory.args[0][1].should.eql(['Foo', getBar]);
    //
    //  injector.get('foo').should.eql('bar');
    //});
  });

});
