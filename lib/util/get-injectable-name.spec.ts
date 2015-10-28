import '../tests/frameworks';
import {providerStore} from '../writers';
import {getInjectableName, getInjectableNameWithJitCreation} from './get-injectable-name';

describe('getInjectableName', function(){
  it('returns an input string', function(){
    getInjectableName('foo').should.eql('foo');
  });

  it('returns the provider metadata name if there is one', function(){
    class Foo {}
    providerStore.set('type', 'foo', Foo);
    providerStore.set('name', 'foo', Foo);
    getInjectableName(Foo).should.contain('foo');
  });
});

describe('getInjectableNameWithJitCreation', function(){
  it('returns an input string', function(){
    getInjectableNameWithJitCreation('foo').should.eql('foo');
  });

  it('returns the provider metadata name if there is one', function(){
    class Foo {}
    providerStore.set('type', 'foo', Foo);
    providerStore.set('name', 'foo', Foo);
    getInjectableNameWithJitCreation(Foo).should.contain('foo');
  });

  it('registers normal classes as a Injectable and then returns their name', function(){
    class Foo {}
    getInjectableNameWithJitCreation(Foo).should.contain('Foo');
  });
});
