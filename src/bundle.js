import {appWriter, providerWriter} from './writers';
import Module from './module';
import events from './util/events';


export default function bundle(moduleName, component, otherProviders = []){
  const name = t => providerWriter.get('name', t);

  let directives = new Map();
  let providers = new Map();
  let modules = [];

  function parseComponentTree(component){
    directives.set(name(component), component);

    (appWriter.get('directives', component) || [])
      .filter(directive => !directives.has(name(directive)))
      .forEach(parseComponentTree);

    (appWriter.get('providers', component) || [])
      .filter(provider => !providers.has(name(provider)))
      .map(provider => [name(provider), provider])
      .forEach(provider => providers.set(...provider));

    modules.push(...(appWriter.get('modules', component) || []));
  }

  function parseProviderTree(provider){
    if( !providers.has(name(provider)) ) {
      providers.set(name(provider), provider);
    }

    (appWriter.get('providers', provider) || [])
      .filter(provider => !providers.has(name(provider)))
      .forEach(parseProviderTree);

    modules.push(...(appWriter.get('modules', provider) || []));
  }

  parseComponentTree(component);
  providers.forEach(parseProviderTree);


  return Module(moduleName, modules).add(
    ...directives.values(),
    ...providers.values(),
    ...otherProviders,
    ...events.resolve()
  );
}
