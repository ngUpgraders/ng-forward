// # Flatten Array Utility
// Takes a nested array and flattens it
//
// ## Usage
// `flatten([1, [2, 3], [[4]], [[[[5, 6]]]]]);`
// Output: `[1, 2, 3, 4, 5, 6]`

export default function flatten(arr){
  if( !Array.isArray(arr) ){
    throw new TypeError('Cannot flatten non-array values');
  }

  let values = [];

  for(let i = 0; i < arr.length; i++){
    if( Array.isArray(arr[i]) ){
      values.push(...flatten(arr[i]));
    }
    else{
      values.push(arr[i]);
    }
  }

  return values;
}
