import { appWriter, providerWriter } from '../writers';
import Module from '../module';
import {Inject} from '../decorators/inject';
import {getInjectableNameWithJitCreation} from './../util/get-injectable-name';
import extend from 'extend';

const TYPE = 'provider';

/**
 * A binding from a token to a value (only one implemented currently), class, existing, or factory
 */
export class Provider {

  _dependencies = [];

  constructor(token, {useClass, useValue, useConstant, useFactory, deps}) {
    try {

      this.token = getInjectableNameWithJitCreation(token);

    } catch (e) {
      throw new Error('new Provider() Error: Invalid token');
    }

    extend(this, {useClass, useValue, useConstant, useFactory});

    if (!useClass && !useValue && !useConstant && !useFactory) {
      throw new Error('new Provider() Error: No usage provided (i.e. useClass, useValue, useConstant, useFactory)')
    }

    if (deps) {
      this._dependencies = deps.map(getInjectableNameWithJitCreation);
    }

    // Setup provider information using the parsed selector
    providerWriter.set('name', this.token, this);
    providerWriter.set('type', TYPE, this);
  }

  get type() {
    if (this._type) return this._type;
    return this._type = Object.keys(this).filter(k => k.startsWith('use') && this[k] !== undefined)[0];
  }
}


// ## Provider Parser
Module.addProvider(TYPE, (provider, name, injects, ngModule) => {
  switch (provider.type) {
    case 'useValue':
        ngModule.value(provider.token, provider.useValue);
        break;
    case 'useConstant':
        ngModule.constant(provider.token, provider.useConstant);
        break;
    case 'useClass':
        injects = appWriter.get('$inject', provider.useClass) || [];
        Module.getParser('service')(provider.useClass, provider.token, injects, ngModule);
        break;
    case 'useFactory':
        ngModule.factory(provider.token, [...provider._dependencies, provider.useFactory]);
        break;
    default:
        break;
  }
});


/**
 * Sugar for creating a new binding.
 * @param token
 */
export const provide = (token, {useClass, useValue, useConstant, useFactory, deps}) => {
  return new Provider(token, {useClass, useValue, useConstant, useFactory, deps});
};