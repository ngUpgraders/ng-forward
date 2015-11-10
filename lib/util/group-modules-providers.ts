import {providerStore} from '../writers';
import {flatten} from './helpers';
import {Provider} from './../classes/provider';

const STRING_TEST = (a: any) => typeof a === 'string';
const PROVIDER_TEST = (a: any) => (typeof a === 'function' || a instanceof Provider) && providerStore.has('name', a);

export default function groupModulesAndProviders(modulesAndProviders: any[], errorContext: string = `while analyzing providers`)
    : { modules: any[], providers: any[] } {
  modulesAndProviders = flatten(modulesAndProviders);

  // find all modules
  let modules = modulesAndProviders.filter(STRING_TEST);
  // find all annotated classes and Providers
  let providers = modulesAndProviders.filter(PROVIDER_TEST);

  let invalid = modulesAndProviders.filter(a => !STRING_TEST(a)).filter(a => !PROVIDER_TEST(a));

  if (invalid.length > 0){
    throw new TypeError(`TypeError ${errorContext}.
    Invalid Providers: please make sure all providers are an Injectable(), Component(), Directive(), a Provider, or a module string.
    Here's the invalid values: ${invalid.join(', ')}`);
  }

  return { modules, providers };
}
