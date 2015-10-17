import {providerWriter} from '../writers';
import flattenArray from './flatten-array';
import {Provider} from './../classes/provider';

const STRING_TEST = a => typeof a === 'string';
const PROVIDER_TEST = a => (typeof a === 'function' || a instanceof Provider) && providerWriter.has('name', a);

export default function groupModulesAndProviders(modulesAndProviders){
  modulesAndProviders = flattenArray(modulesAndProviders);

  // find all modules
  let modules = modulesAndProviders.filter(STRING_TEST);
  // find all annotated classes and Providers
  let providers = modulesAndProviders.filter(PROVIDER_TEST);

  if(modulesAndProviders.length !== modules.length + providers.length){
    throw new Error('One or more of your providers was not valid. Please make sure all providers are either: ' +
        'a class, decorated class, Provider instance, or module string');
  }

  return { modules, providers };
}
