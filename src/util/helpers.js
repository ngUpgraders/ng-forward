export function ucFirst(word) {
  return word.charAt(0).toUpperCase() + word.substr(1)
}

export function dashToCamel(dash) {
  var words = dash.split('-');
  return words.shift() + words.map(ucFirst).join('')
}

var SNAKE_CASE_REGEXP = /[A-Z]/g;
export function dasherize(name, separator) {
  separator = separator || '-';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

export function snakeCase(name, separator) {
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}