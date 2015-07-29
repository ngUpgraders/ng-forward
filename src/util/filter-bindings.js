import {providerWriter} from '../writers';
import flattenArray from './flatten-array';

const STRING_TEST = a => typeof a === 'string';
const PROVIDER_TEST = a => typeof a === 'function' && providerWriter.has('name', a);

export default function filterBindings(rawBindings){
  let bindings = flattenArray(rawBindings);

  let modules = bindings.filter(STRING_TEST);
  let providers = bindings.filter(PROVIDER_TEST);

  if(bindings.filter(STRING_TEST).filter(PROVIDER_TEST).length > 0){
    throw new Error('Unidentified injectable type. Sorry this message is not clearer!');
  }

  return { modules, providers };
}
