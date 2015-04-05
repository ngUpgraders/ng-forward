export function parseComponentSelector(selector){
	let type = 'E';
	let selectorArray = selector.split('-');

	if(selectorArray[0][0] === '[')
	{
		type = 'A';
		
		let first = selectorArray[0];
		first = first.splice(1, first.length - 2);

		if(selectorArray.length == 1)
		{
			first = first.splice(0, first.length - 2);

			selectorArray = [first];
		}
		else
		{
			let last = selectorArray[selectorArray.length - 1];
			last = last.splice(0, last.length - 2);

			selectorArray.shift().pop();

			for(selector in selectorArray)
			{
				selector = selector.splice(1, selector.length - 2);
			}

			selectorArray = [ first, ...selectorArray, last ];
		}
	}
	else
	{
		let first = selectorArray.shift();

		if(first[0] === '.')
		{
			type = 'C';
			first = first.splice(1, first.lenght - 2);
		}


		for(selector in selectorArray)
		{
			selector = selector.splice(1, selector.length - 2);
		}

		selectorArray = [ first, ...selectorArray ];
	}

	let first = selectorArray.shift();

	for(s in selectorArray)
	{
		s = s.splice(0,1).toUpperCase() + s.splice(1, s.length - 2);
	}

	return {
		name : [first, ...selectorArray].join(),
		type
	};
}