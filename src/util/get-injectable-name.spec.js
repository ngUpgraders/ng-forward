/* global describe, it */
import {getInjectableName, getInjectableNameWithJitCreation} from './get-injectable-name';
import {providerWriter} from '../writers';
import '../tests/frameworks';

describe('getInjectableName', function(){
  it('returns an input string', function(){
    getInjectableName('foo').should.eql('foo');
  });

  it('returns the provider metadata name if there is one', function(){
    class Foo {}
    providerWriter.set('type', 'foo', Foo);
    providerWriter.set('name', 'foo', Foo);
    getInjectableName(Foo).should.eql('foo');
  });
});

describe('getInjectableNameWithJitCreation', function(){
  it('returns an input string', function(){
    getInjectableNameWithJitCreation('foo').should.eql('foo');
  });

  it('returns the provider metadata name if there is one', function(){
    class Foo {}
    providerWriter.set('type', 'foo', Foo);
    providerWriter.set('name', 'foo', Foo);
    getInjectableNameWithJitCreation(Foo).should.eql('foo');
  });

  it('registers normal classes as a Service and then returns their name', function(){
    class Foo {}
    getInjectableNameWithJitCreation(Foo).should.eql('Foo');
  });
});
