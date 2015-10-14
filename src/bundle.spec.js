/* global describe, it */
import './tests/frameworks';
import bundle from './bundle';
import {Component} from './decorators/providers/component';
import {Directive} from './decorators/providers/directive';
import {Inject} from './decorators/inject';
import {DecoratedModule} from './module';
import {Provider} from './util/provider';

let fooProvider = new Provider('foo', {useValue: 'bar'});

@Component({
  selector: 'nested2',
  providers: [['module-c'], fooProvider],
  events: ['event2']
})
class Nested2 {}

@Component({
  selector: 'nested1',
  providers: ['module-b', [Nested2]],
  events: ['event1']
})
class Nested1 {}

@Component({
  selector: 'my-app',
  providers: ['module-a', Nested1]
})
class MyApp {}


describe('bundle a module', () => {
  let moduleAddStub;

  beforeEach(() => {
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
    module._dependencies.should.be.eql(['module-a', 'module-b', 'module-c']);
  });

  it('with added annotated classes defined in providers from provider tree', () => {
    let module = bundle('foo', MyApp)._module;
    let groupedByClass = moduleAddStub.args[0].reduce((memo, p) => {
      var key = p.name || 'other';
      (memo[key] = memo[key] || []).push(p);
      return memo;
    }, {});

    groupedByClass.EventHandler.length.should.be.above(1);
    groupedByClass.MyApp.length.should.be.eql(1);
    groupedByClass.Nested1.length.should.be.eql(1);
    groupedByClass.Nested2.length.should.be.eql(1);
    groupedByClass.other.length.should.be.eql(1);
    groupedByClass.other[0].should.be.eql(fooProvider);
  });
});