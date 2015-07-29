// This is a simple clone of @hannahhoward's a1atrscipt implementation of custom
// properties. See: https://github.com/hannahhoward/a1atscript/blob/master/src/a1atscript/ng2Directives/PropertiesBuilder.js
const BIND_PREFIX = '_=_';
const STRING_PREFIX = '_@_';

export function propertiesMap(properties){
  let definition = {};

  for(let key in properties){
    let property = properties[key];
    definition[`${STRING_PREFIX}${key}`] = `@${property}`;
    definition[`${BIND_PREFIX}${key}`] = `=?bind${property[0].toUpperCase()}${property.slice(1)}`;
  }

  return definition;
}

export function propertiesBuilder(obj, key, property){
    const genericSetter = (use, errorOn) => function(value){
      this.__using_binding__ = this.__using_binding__  || {};
      if(this.__using_binding__[key] === errorOn){
        if(value !== undefined){
          throw new Error(`Cannot use bind-${property} and ${property} simultaneously`);
        }

        return;
      }

      if(value !== undefined){
        this.__using_binding__[key] = use;
      }

      this[key] = value;
    };

    Object.defineProperties(obj, {
      [`${BIND_PREFIX}${key}`]: {
        enumerable: true,
        configurable: true,
        set: genericSetter(BIND_PREFIX, STRING_PREFIX),
        get: function(){
          return this[key];
        }
      },
      [`${STRING_PREFIX}${key}`]: {
        enumerable: true,
        configurable: true,
        set: genericSetter(STRING_PREFIX, BIND_PREFIX),
        get: function(){
          return this[key];
        }
      }
    });
}
