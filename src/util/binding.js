import { providerWriter } from '../writers';

/**
 * Stores references to all bindings. Is cleared by TestComponentBuilder after a create call.
 * @type {Array}
 * @private
 */
let _bindings = [];

/**
 * A binding from a token to a value (only one implemented currently), class, alias, or factory
 */
export class Binding {
  constructor(token) {
    try {
      this.token = typeof token === 'string'
          ? token
          : providerWriter.get('name', token);
    } catch (e) {
      throw new Error('Binding Error: Invalid token');
    }
  }
  toValue(value) {
    this.value = value;
    return this;
  }
  static get bindings() {
    return _bindings;
  }
  static clear() {
    _bindings = [];
  }
  toClass() { throw new Error('not implemented'); }
  toAlias() { throw new Error('not implemented'); }
  toFactory() { throw new Error('not implemented'); }
}


/**
 * Sugar for creating a new binding.
 * @param token
 */
export const bind = token => {
  return new Binding(token);
};