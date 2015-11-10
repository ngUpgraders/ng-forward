import {expect} from '../tests/frameworks';
import groupModulesAndProviders from './group-modules-providers';
import {providerStore} from '../writers';
import {Provider} from '../classes/provider';

const Test = t => {
  providerStore.set('type', 'test', t);
  providerStore.set('name', t.name, t);
};

describe('groupIntoModulesAndProviders Utility', function(){
  it('should separate providers and string-based module names', function(){
    @Test
    class Example{ }

    let p = new Provider('foo', {useValue: 'bar'});

    let {modules, providers} = groupModulesAndProviders(['ui-router', 'ui-bootstrap', p, Example]);

    modules.should.eql(['ui-router', 'ui-bootstrap']);
    providers.should.eql([p, Example]);
  });

  it('should flatten the array if it is an array of arrays', function(){
    @Test
    class Example{ }

    let p = new Provider('foo', {useValue: 'bar'});

    let {modules, providers} = groupModulesAndProviders([['ui-router'], 'ui-bootstrap', [Example, [p]]]);

    modules.should.eql(['ui-router', 'ui-bootstrap']);
    providers.should.eql([Example, p]);
  });

  it('should throw error when invalid module or provider in providers array', function(){
    class InvalidDueToNoAnnotations{ }

    expect(() => {
      groupModulesAndProviders([InvalidDueToNoAnnotations]);
    }).to.throw(/TypeError while analyzing providers[\s\S]*InvalidDueToNoAnnotations/m);
  });

  it('should throw custom error with context', function(){
    class InvalidDueToNoAnnotations{ }

    expect(() => {
      groupModulesAndProviders([InvalidDueToNoAnnotations], `while fooing the bar`);
    }).to.throw(/TypeError while fooing the bar[\s\S]*InvalidDueToNoAnnotations/m);
  });
});
