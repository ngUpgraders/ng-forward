const ALLOWED_SYMBOLS = ['&', '=', '@', '=', '*', '?'];

function checkBindingType(str){
	return (ALLOWED_SYMBOLS.indexOf(str.charAt(0)) !== -1);
}

function parseProperty(str){
	let symbols = [];

	function getName(input){
		if(checkBindingType(input.join('')))
		{
			symbols.push(input.shift());
			return getName(input);
		}

		return input;
	}

	let name = getName(str.split(''));

	return { name: name.join(''), symbols: symbols.join('') };
}

export default function(props){
	let map = {};

	for(let i = 0; i < props.length; i++){
		let split = props[i].split(':');

		for(let y = 0; y < split.length; y++){
			split[y] = split[y].trim();
		}

		if(split.length === 1 && checkBindingType(split[0])){
			let {name, symbols} = parseProperty(split[0]);
			map[name] = symbols;
		}
		else if(split.length === 2 && checkBindingType(split[1])){
			map[split[0]] = split[1];
		}
		else{
			throw new Error('Properties must be in the form of "propName: [&, @, =, =*, =?, =*?]attrName" or in the form of "[&, @, =, =*, =?, =*?]attrName"');
		}
	}

	return map;
}