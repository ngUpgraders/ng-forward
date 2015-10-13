/*global describe,it */
import '../tests/frameworks';
import { providerWriter } from '../writers';
import { Binding, bind } from './binding';

class SomeToken {}

describe('Binding Class', () => {
  let someValue;

  beforeEach(() => {
    providerWriter.set('name', 'someToken', SomeToken);
    someValue = 'foo';
  });

  it('should bind a decorated service token', () => {
    let b = new Binding(SomeToken);
    expect(b.token).to.equal('someToken');
  });

  it('should bind a string-based service token', () => {
    let b = new Binding('$http');
    expect(b.token).to.equal('$http');
  });

  it('should throw Invalid token if no token provided', () => {
    expect(() => new Binding()).to.throw;
  });

  it('should bind to a value', () => {
    let b = new Binding('').toValue(someValue);
    expect(b.value).to.equal('foo');
  });
});

describe('bind method', () => {
  it('should alias to new Binding() call', () => {
    expect(bind('foo')).to.be.an.instanceOf(Binding);
    expect(bind('foo').token).to.be.equal('foo');
  })
});
