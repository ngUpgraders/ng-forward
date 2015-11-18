import {componentStore} from '../writers';
import parsePropertyMap from '../properties/parse-property-map';
import events from '../events/events';

export const writeMapSingle = (t, localName, publicName, storeKey) => {
	let put = localName + (publicName ? `:${publicName}` : ``);
	let putMap = parsePropertyMap([put]);
	let previousPutMap = componentStore.get(storeKey, t) || {};
	componentStore.set(storeKey, Object.assign({}, previousPutMap, putMap), t);
	return putMap;
};

export const writeMapMulti = (t, names, storeKey) => {
	let putMap = parsePropertyMap(names);
	let previousPutMap = componentStore.get(storeKey, t) || {};
	componentStore.set(storeKey, Object.assign({}, previousPutMap, putMap), t);
	return putMap;
};

export function Input(publicName: string){
	return function(proto: any, localName: string, descriptor){
		//console.log(descriptor);
		//descriptor.initializer = function() {
		//	return this[localName];
		//};

		writeMapSingle(proto.constructor, localName, publicName, 'inputMap');
	}
}

export function Output(publicName: string){
	return function(proto: any, localName: string){
		let outputMap = writeMapSingle(proto.constructor, localName, publicName, 'outputMap');
		Object.keys(outputMap).forEach(key => events.add(key));
	}
}
