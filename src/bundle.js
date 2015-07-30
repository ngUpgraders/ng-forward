// # Bundle function
// Takes a root decorated class and generates a Module from it

// ## Setup
// All information about traversing a provider is written by the appWriter
import {appWriter} from './writers';
// The bundle is going to be generating a Module, so we'll need this
import Module from './module';
// Events is a utility for generating semi-dynamic events. It will be generating
// a lot of attribute directives for event handling.
import events from './util/events';
// Takes an array of bindings and separates it into decorated classes and string
// names. Usually these string names are the names of angular modules.
import filterBindings from './util/filter-bindings';

// ## Bundle
// The bundle function. Pass it the name of the module you want to generate, the root
// provider, and an option list of additional bindings the provider may need to
// successfully bootstrap. The idea is that you only need to provide bindings if you
// are testing a component or service in isolation
export default function bundle(moduleName, provider, bindings = []){
  // Get a list of decorated classes that some decorated class `t` depends on
  const getProviders = t => appWriter.get('providers', t) || [];
  // Get a list of `angular.module` names some decorated class `t` depends on
  const getModules = t => appWriter.get('modules', t) || [];

  // Kick the process off by getting the list of `angular.module`s and decorated
  // classes the root provider requires
  let {modules: startingModules, providers: startingProviders} = filterBindings([provider, ...bindings]);


  // This set will be used to hold providers as they are traversed.
  // Since sets can only contain unique values, we'll use this set to see if the provider
  // has already been traversed. This will prevent circular references and providers
  // being added multiple times.
  let providers = new Set();
  // Create a new set of `angular.module`s based on the modules required by the
  // root provider
  let modules = new Set(startingModules);

  // Recursive parsing function. Takes a provider and adds modules to the modules
  // set. Then traverses the providers it depends on.
  function parseProvider(provider){
    // Check to see if the provider is defined and hasn't been traversed already 
    if( provider && !providers.has(provider) ){
      // Add the provider to the providers set
      providers.add(provider);
      // Add the moduels to the modules set
      getModules(provider).forEach(mod => modules.add(mod));
      // Parse the inner providers
      getProviders(provider).forEach(parseProvider);
    }
  }

  // Take the array of starting providers and begin the traversal
  startingProviders.forEach(parseProvider);

  // Create our Module and add all of the providers we found during traversal
  return Module(moduleName, [...modules.values()]).add(
    ...events.resolve(),
    ...providers.values()
  );
}
