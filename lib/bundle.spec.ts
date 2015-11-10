import {sinon, expect} from './tests/frameworks';
import bundle from './bundle';
import {Component} from './decorators/component';
import {Inject} from './decorators/inject';
import {DecoratedModule} from './classes/module';
import {Provider} from './classes/provider';

describe('bundle a module', () => {
  let moduleAddStub;
  let MyApp;
  let Nested1;
  let Nested2;
  let fooProvider;

  beforeEach(() => {
    fooProvider = new Provider('foo', {useValue: 'bar'});

    @Component({
      selector: 'nested2',
      template: true,
      providers: [['module-c'], fooProvider],
      outputs: ['event2']
    })
    class _Nested2 {}

    Nested2 = _Nested2;

    @Component({
      selector: 'nested1',
      template: true,
      providers: ['module-b', [Nested2]],
      outputs: ['event1']
    })
    class _Nested1 {}

    Nested1 = _Nested1;

    @Component({
      selector: 'my-app',
      template: true,
      providers: ['module-a', Nested1]
    })
    class _MyApp {}

    MyApp = _MyApp;

    moduleAddStub = sinon.stub(DecoratedModule.prototype, 'add').returnsThis();
  });

  afterEach(() => {
    moduleAddStub.restore();
  });

  it('with provided name', () => {
    let module = bundle('foo', MyApp);
    module.name.should.be.equal('foo');
  });

  it('with required modules defined in providers from provider tree', () => {
    let module = bundle('foo', MyApp);
    //noinspection TypeScriptUnresolvedVariable
    module._dependencies.should.be.eql(['module-a', 'module-b', 'module-c']);
  });

  it('with added annotated classes defined in providers from provider tree', () => {
    //noinspection TypeScriptUnresolvedVariable
    let module = bundle('foo', MyApp)._module;
    let groupedByClass = moduleAddStub.args[0].reduce((memo, p) => {
      var key = p.name || 'other';
      (memo[key] = memo[key] || []).push(p);
      return memo;
    }, {});

    groupedByClass.EventHandler.length.should.be.above(1);
    groupedByClass._MyApp.length.should.be.eql(1);
    groupedByClass._Nested1.length.should.be.eql(1);
    groupedByClass._Nested2.length.should.be.eql(1);
    groupedByClass.other.length.should.be.eql(1);
    groupedByClass.other[0].should.be.eql(fooProvider);
  });

  it('throws an error if attempting to bundle an invalid Component', () => {
    class InvalidDueToNoAnnotations {}

    expect(() => {
      bundle('foo', InvalidDueToNoAnnotations);
    }).to.throw(/TypeError during bundle entry point for 'foo' module/);
  });
});