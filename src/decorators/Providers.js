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
import {appWriter} from '../writers';
import groupIntoModulesAndProviders from '../util/group-modules-providers';

export const Providers = (...modulesAndProviders) => t => {
  let { modules, providers } = groupIntoModulesAndProviders(modulesAndProviders);

  let parentModules = appWriter.get('modules', t) || [];
  appWriter.set('modules', [...modules, ...parentModules], t);

  let parentProviders = appWriter.get('providers', t) || [];
  appWriter.set('providers', [...providers, ...parentProviders], t);
};
