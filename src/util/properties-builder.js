// This is an implementation that blends a bit of @hannahhoward's a1atscript implementation of custom
// properties and @mitranim's ng-decorate one way binding technique.
// See: https://github.com/hannahhoward/a1atscript/blob/master/src/a1atscript/ng2Directives/PropertiesBuilder.js
// See: https://github.com/Mitranim/ng-decorate/blob/master/src/bindings.ts#L165
const STRING = '_bind_string_';
const BIND_ONEWAY = '_bind_oneway_';
const BIND_TWOWAY = '_bind_twoway_';

// This function is responsible for transforming the properties from @Component to ng1 DDO bindings.
export function propertiesMap(properties){
  let definition = {};

  for (let key in properties) {
    let lowercaseProperty = properties[key];

    // For each property we have to create three possible attributes that the end-dev can use. So if we have property
    // 'color', we create a string-bound attr <component color="red">, a one-way bound attr <component bind-color="expression">,
    // and a two-way bound attr <component bind-on-color="expression">.

    // We bind to three hidden properties on the controller class instance, i.e. _bind_string_color, _bind_oneway_color, _bind_twoway_color.
    definition[`${STRING}${key}`] = `@${lowercaseProperty}`;
    definition[`[${properties[key]}]`] = `&`;
    definition[`[(${properties[key]})]`] = `=?`;
  }

  return definition;
}

export function propertiesBuilder(controller, key, value){
  // We are going to be installing a lot of properties on the controller to handle the magic
  // of our property bindings. Here we are marking them as hidden but writeable, that way
  // we don't leak our abstraction
  let propertyDefinitions = {};

  [`${STRING}${key}`, `[${value}]`, `[(${value})]`, `__using_binding`].forEach(prop => {
    propertyDefinitions[prop] = {
      enumerable: false,
      configurable: false,
      writable: true,
      value: controller[prop]
    };
  });

  Object.defineProperties(controller, propertyDefinitions);

  // Later during controller instantiation we create a special getter/setter that handles the various binding strategies.
  Object.defineProperties(controller, {
    [key]: {
      enumerable: true,
      configurable: true,
      get: function() {
        const getBindingInUseVal = () => {
          if (this.__using_binding[key]) {
            let using = this.__using_binding[key];

            if(using === STRING){
              return this[`${STRING}${key}`];
            }
            else if(using === BIND_ONEWAY){
              return this[`[${value}]`]();
            }
            else if(using === BIND_TWOWAY){
              return this[`[(${value})]`];
            }
            else{
              throw new Error(`Unknown property binding detected: ${using}`);
            }
          }
        };

        // When getting the key first check if we've already determined which binding we are using for this particular
        // key. If we have, then just return it.
        this.__using_binding = this.__using_binding || {};
        let bindingInUseVal = getBindingInUseVal();
        if (bindingInUseVal) return bindingInUseVal;

        // If we haven't determined which binding we are using yet, we go ahead and access all of them to see if they
        // contain values.
        let stringVal = this[`${STRING}${key}`];
        let oneWayVal = this[`[${value}]`]();
        let twoWayVal = this[`[(${value})]`];

        // For each one, if it is a valid value, we'll set it as the binding we are using. setBindingUsed will throw
        // an error if we try to use more than one at a time.
        if (stringVal){
          setBindingUsed(this, STRING, key);
        }
        if (oneWayVal){
          setBindingUsed(this, BIND_ONEWAY, key);
        }
        if (twoWayVal){
          setBindingUsed(this, BIND_TWOWAY, key);
        }

        // Now we know which we are using, so get the binding val (or getter function in the case of one-way).
        bindingInUseVal = getBindingInUseVal();
        return bindingInUseVal;
      },
      set: function(val) {
        if (this.__using_binding[key] === BIND_TWOWAY) {
          this[`[(${value})]`] = val;
        }
      }
    }
  });
}

function setBindingUsed(controller, using, key) {
  if (controller.__using_binding[key] && controller.__using_binding[key] !== using) {
    throw new Error(`Can not use more than one type of attribute binding simultaneously: ${key}, bind-${key}, bind-on-${key}`);
  }
  controller.__using_binding[key] = using;
}
