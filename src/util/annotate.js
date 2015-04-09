import clone from 'clone';
import extend from 'extend';

export default function annotate(obj, property, value = {}){
	obj[property] = obj[property] ? clone(obj[property]) : {};

	extend(true, obj[property], value);
}