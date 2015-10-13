export function ucFirst(word) {
  return word.charAt(0).toUpperCase() + word.substr(1)
}

export function dashToCamel(dash) {
  var words = dash.split('-');
  return words.shift() + words.map(ucFirst).join('')
}