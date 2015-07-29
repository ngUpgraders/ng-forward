import {appWriter} from '../writers';
import filterBindings from '../util/filter-bindings';

export const Injectables = (...injectables) => t => {
  let { modules, providers } = filterBindings(injectables);

  let parentModules = appWriter.get('modules', t) || [];
  appWriter.set('modules', [...modules, ...parentModules], t);
  
  let parentProviders = appWriter.get('providers', t) || [];
  appWriter.set('providers', [...providers, ...parentProviders], t);
};
