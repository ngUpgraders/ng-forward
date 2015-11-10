// # Injectables Decorator
//
// This decorator takes a list of bindings/injectables and filters it into
// two lists: module names ('ui-router', 'ngAria') and provider classes/functions.
// Then it sets this information using the appWriter, preserving information from
// a parent class. This is used by the `bundle` function for traversal.
//
// It is also worth noting that this injectable is used by `@Component` to handle
// the bindings array that you can pass to it as well as the directives array you
// can pass to `@View`.
//
// Simple decorator, not likely to be used on its own.
import {bundleStore} from '../writers';
import groupIntoModulesAndProviders from '../util/group-modules-providers';

export function Providers(...modulesAndProviders: any[]){
  return function(t: any, errorContext: string = `while parsing ${t.name}'s providers`){
    let { modules, providers } = groupIntoModulesAndProviders(modulesAndProviders, errorContext);
  
    let parentModules = bundleStore.get('modules', t) || [];
    bundleStore.set('modules', [...modules, ...parentModules], t);
  
    let parentProviders = bundleStore.get('providers', t) || [];
    bundleStore.set('providers', [...providers, ...parentProviders], t);
  }
}
