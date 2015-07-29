/* global describe, it */
import '../tests/frameworks';
import filterBindings from './filter-bindings';
import {providerWriter} from '../writers';

const Test = t => {
  providerWriter.set('type', 'test', t);
  providerWriter.set('name', t.name, t);
};

describe('filterBindings Utility', function(){
  it('should separate providers and string-based module names', function(){
    @Test
    class Example{ }

    let {modules, providers} = filterBindings(['ui-router', 'ui-bootstrap', Example]);

    modules.should.eql(['ui-router', 'ui-bootstrap']);
    providers.should.eql([Example]);
  });

  it('should flatten the array if it is an array of arrays', function(){
    @Test
    class Example{ }

    @Test
    class Another{ }

    let {modules, providers} = filterBindings([['ui-router'], 'ui-bootstrap', [Example, [Another]]]);

    modules.should.eql(['ui-router', 'ui-bootstrap']);
    providers.should.eql([Example, Another]);
  });
});
