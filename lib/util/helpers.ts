const SNAKE_CASE_REGEXP = /[A-Z]/g;

export function ucFirst(word: string): string {
  return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
}

export function dashToCamel(dash: string): string{
  let words = dash.split('-');
  return `${words.shift()}${words.map(ucFirst).join('')}`;
}

export function dasherize(name: string, separator: string = '-'): string {

  return name.replace(SNAKE_CASE_REGEXP, (letter: string, pos: number) => {
    return `${(pos ? separator : '')}${letter.toLowerCase()}`;
  });
}

export function snakeCase(name: string, separator: string = '-'): string {
  return name.replace(SNAKE_CASE_REGEXP, (letter: string, pos: number) => {
    return `${(pos ? separator : '')}${letter.toLowerCase()}`;
  });
}

export function flatten(items: any[]): any[]{
  let resolved: any[] = [];
  for(let item of items){
    if(Array.isArray(item)){
      resolved.push(...flatten(item));
    }
    else{
      resolved.push(item);
    }
  }
  
  return resolved;
}