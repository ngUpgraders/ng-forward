import { providerWriter } from '../writers';
// ## Intro
// Import the `@Service` decorator. We'll apply it to functions/classes that are
// injected that are missing provider metadata. Convenience!
import { Service } from '../decorators/providers/service';
import { OpaqueToken } from '../classes/opaque-token';

export const getInjectableName = (injectable) => {
  // Return it if it is already a string like `'$http'` or `'$state'`
  if(typeof injectable === 'string' || injectable instanceof OpaqueToken) {
    return injectable.toString();
  }
  // If the injectable is not a string but has provider information, use
  // the provider name. This is set by the collection of provider decorators
  else if(providerWriter.has('type', injectable)) {
    return providerWriter.get('name', injectable);
  }
};

export const getInjectableNameWithJitCreation = (injectable) => {
  let name = getInjectableName(injectable);

  if (name) {
    return name;
  }

  // If it is a function but is missing provider information, apply the Service
  // provider decorator to the function to turn it into a service.
  if (typeof injectable === 'function') {
    Service(injectable);
    return providerWriter.get('name', injectable);
  }
};