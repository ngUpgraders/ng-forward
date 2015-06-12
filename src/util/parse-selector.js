export default function(selector){
	let selectorArray;
	let type;

	if( selector.match(/\[(.*?)\]/) !== null )
	{
		selectorArray = selector.slice(1, selector.length - 1).split('-');
		type = 'A';
	}
	else if( selector[0] === '.' )
	{
		selectorArray = selector.slice(1, selector.length).split('-');
		type = 'C';
	}
	else
	{
		selectorArray = selector.split('-');
		type = 'E';
	}

	let first = selectorArray.shift();
	let name;

	if(selectorArray.length > 0)
	{
		for(let i = 0; i < selectorArray.length; i++)
		{
			let s = selectorArray[i];
			s = s.slice(0,1).toUpperCase() + s.slice(1, s.length);
			selectorArray[i] = s;
		}

		name = [first, ...selectorArray].join('');
	}
	else
	{
		name = first;
	}

	return { name, type };
}