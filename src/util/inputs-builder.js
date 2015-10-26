// This is an implementation that blends a bit of @hannahhoward's a1atscript implementation of custom
// inputs and @mitranim's ng-decorate one way binding technique.
// See: https://github.com/hannahhoward/a1atscript/blob/master/src/a1atscript/ng2Directives/PropertiesBuilder.js
// See: https://github.com/Mitranim/ng-decorate/blob/master/src/bindings.ts#L165
const BIND_STRING = '_bind_string_';
const BIND_ONEWAY = '_bind_oneway_';
const BIND_TWOWAY = '_bind_twoway_';

function isDefined(value) {return typeof value !== 'undefined';}

// This function is responsible for transforming the inputs from @Component to ng1 DDO bindings.
export function inputsMap(inputs){
  let definition = {};

  for (let key in inputs) {
    let lowercaseInput = inputs[key];
    definition[`@${key}`] = `@${lowercaseInput}`;
    definition[`[${inputs[key]}]`] = `=?`;
    definition[`[(${inputs[key]})]`] = `=?`;
  }

  return definition;
}

export function inputsBuilder(controller, localKey, publicKey){
  // We are going to be installing a lot of properties on the controller to handle the magic
  // of our input bindings. Here we are marking them as hidden but writeable, that way
  // we don't leak our abstraction

  let stringKey = `@${localKey}`;
  let __stringKey = `__@${localKey}`;
  let oneWayKey = `[${publicKey}]`;
  let __oneWayKey = `__[${publicKey}]`;
  let twoWayKey = `[(${publicKey})]`;
  let __twoWayKey = `__[(${publicKey})]`;

  Object.defineProperties(controller, {

    [stringKey]: {
      enumerable: false, configurable: false,
      set: createHiddenPropSetting(BIND_STRING, __stringKey),
      get() { return this[__stringKey]; }
    },

    [oneWayKey]: {
      enumerable: false, configurable: false,
      set: createHiddenPropSetting(BIND_ONEWAY, __oneWayKey),
      get() { return this[__oneWayKey]; }
    },

    [twoWayKey]: {
      enumerable: false, configurable: false,
      set: createHiddenPropSetting(BIND_TWOWAY, __twoWayKey),
      get() { return this[localKey]; }
    },

    __using_binding: {
      enumerable: false, configurable: false, writable: true,
      value: controller.__using_binding || {}
    }
  });

  function createHiddenPropSetting(BIND_TYPE, __privateKey) {
    return function(val) {
      this[__privateKey] = val;

      if (isDefined(val)) {
        setBindingUsed(BIND_TYPE, localKey);
      }

      if (controller.__using_binding[localKey] === BIND_TYPE) {
        this[localKey] = val;
      }
    }
  }

  function setBindingUsed(using, key) {
    if (controller.__using_binding[key] && controller.__using_binding[key] !== using) {
      throw new Error(`Can not use more than one type of attribute binding simultaneously: ${key}, [${key}], [(${key})]. Choose one.`);
    }
    controller.__using_binding[key] = using;
  }
}
