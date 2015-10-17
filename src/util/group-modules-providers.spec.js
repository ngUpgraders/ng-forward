/* global describe, it */
import '../tests/frameworks';
import groupModulesAndProviders from './group-modules-providers';
import {providerWriter} from '../writers';
import {Provider} from '../classes/provider';

const Test = t => {
  providerWriter.set('type', 'test', t);
  providerWriter.set('name', t.name, t);
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
});
