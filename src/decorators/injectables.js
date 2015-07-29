import {providerWriter, appWriter} from '../writers';

export const Injectables = (...injectables) => t => {
  const STRING_TEST = a => typeof a === 'string';
  const PROVIDER_TEST = a => typeof a === 'function' && providerWriter.has('name', a);

  const stringInjects = injectables.filter(STRING_TEST);
  const providerInjects = injectables.filter(PROVIDER_TEST);

  if(injectables.filter(STRING_TEST).filter(PROVIDER_TEST).length > 0){
    throw new Error('Unidentified injectable type. Sorry this message is not clearer!');
  }

  let modules = appWriter.get('modules', t) || [];
  appWriter.set('modules', [...modules, ...stringInjects], t);
  let providers = appWriter.get('providers', t) || [];
  appWriter.set('providers', [...providers, ...providerInjects], t);
};
