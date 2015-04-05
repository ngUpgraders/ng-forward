export function parseComponentSelector(selector){
	let selectorArray;

	if( selector.match(/\[(.*?)\]/) !== null )
	{
		selectorArray = selector.shift().pop().split('-');
		type = 'A';
	}
	else if( selector[0] === '.' )
	{
		selectorArray = selector.shift().split('-');
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
		for(s in selectorArray)
		{
			s = s.splice(0,1).toUpperCase() + s.splice(1, s.length - 2);
		}

		name = [first, ...selectorArray];
	}
	else
	{
		name = first;
	}

	return { name, type };
}