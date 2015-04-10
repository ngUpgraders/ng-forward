import clone from 'clone';
import extend from 'extend';
import is from 'is-js';

function install(obj, property, base){
	obj[property] = obj[property] ? clone(obj[property]) : base;
}

export default function annotate(obj, property, value = {}){
	if(is.array(value))
	{
		install(obj, property, []);

		obj[property].push(...value);		
	}
	else if(is.string(value))
	{
		obj[property] = value;
	}
	else if(is.fn(value))
	{
		obj[property] = value;
	}
	else if(is.object(value))
	{
		install(obj, property, {});

		extend(true, obj[property], value);
	}
}