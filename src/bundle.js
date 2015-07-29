import {appWriter, providerWriter} from './writers';
import Module from './module';
import events from './util/events';


export default function bundle(moduleName, provider, otherProviders = []){
  const getName = t => providerWriter.get('name', t);
  const getProviders = t => appWriter.get('providers', t) || [];
  const getModules = t => appWriter.get('modules', t) || [];

  let modules = new Set();
  let providers = {
    directive: new Map(),
    filter: new Map(),
    provider: new Map(),
    animation: new Map()
  };

  function parseProvider(provider){
    let name = getName(provider);
    let strategy = appWriter.get('traversalStrategy', provider);

    if( providers[strategy] && !providers[strategy].has(name) ){
      providers[strategy].set(name, provider);
      getModules(provider).forEach(mod => modules.add(mod));
      getProviders(provider).forEach(parseProvider);
    }
  }

  parseProvider(provider);


  return Module(moduleName, [...modules.values()]).add(
    ...providers.directive.values(),
    ...providers.filter.values(),
    ...providers.provider.values(),
    ...providers.animation.values(),
    ...events.resolve()
  );
}
