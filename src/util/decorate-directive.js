import Module from '../module';
import {componentWriter} from '../writers';
import parseProperties from './parse-properties';
import extend from 'extend';
import events from '../util/events';
import strategy from '../util/strategy';

export default function(config, t){
	// Support for legacy angular-decorators bind config
	if(config.bind){
		componentWriter.set('scope', config.bind, t);
		componentWriter.set('bindToController', true, t);
	}

	// Check for scope
	if(config.scope){
		let scope = componentWriter.get('scope', t);

		if(scope && typeof scope === 'object')
		{
			componentWriter.set('scope', extend(scope, config.scope), t);
		}
		else
		{
			componentWriter.set('scope', config.scope, t);
		}
	}


	// Check for Angular 2 style properties
	if(config.properties && Array.isArray(config.properties)){
		let binders = parseProperties(config.properties);
		let previous = componentWriter.get('bindToController', t);

		if(previous && typeof previous === 'object')
		{
			componentWriter.set('bindToController', extend(previous, binders), t);
		}
		else
		{
			componentWriter.set('bindToController', parseProperties(config.properties), t);
		}
	}
	else if(config.properties !== undefined){
		throw new TypeError('Component properties must be an array');
	}

	// events
	if(config.events && Array.isArray(config.events)){
		events.add(...config.events);
	}

	// Allow for renaming the controllerAs
	if(config.controllerAs){
		componentWriter.set('controllerAs', config.controllerAs, t);
	}

	// Set a link function
	if(t.link){
		componentWriter.set('link', t.link, t);
	}

	// Set a controller function
	if(t.compile){
		componentWriter.set('compile', t.compile, t);
	}

	strategy('directive', t);
}

Module.addProvider('directive', (target, name, injects, ngModule) => {
	let ddo = {};

	componentWriter.forEach((val, key) => {
		ddo[key] = val;
	}, target);

	ddo.controller = [...injects, target];

	ngModule.directive(name, () => ddo);
});
