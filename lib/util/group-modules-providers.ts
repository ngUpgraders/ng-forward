import {providerStore} from '../writers';
import {flatten} from './helpers';
import {Provider} from './../classes/provider';

const STRING_TEST = (a: any) => typeof a === 'string';
const PROVIDER_TEST = (a: any) => (typeof a === 'function' || a instanceof Provider) && providerStore.has('name', a);

export default function groupModulesAndProviders(modulesAndProviders: any[]): { modules: any[], providers: any[] }{
  modulesAndProviders = flatten(modulesAndProviders);

  // find all modules
  let modules = modulesAndProviders.filter(STRING_TEST);
  // find all annotated classes and Providers
  let providers = modulesAndProviders.filter(PROVIDER_TEST);

  if(modulesAndProviders.length !== modules.length + providers.length){
    throw new Error('One or more of your providers was not valid. Please make sure all providers are either: ' +
        'decorated class, Provider instance, or module string');
  }

  return { modules, providers };
}
