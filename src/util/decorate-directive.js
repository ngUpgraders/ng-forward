import Module from '../module';
import {componentWriter} from '../writers';
import parseProperties from './parse-properties';
import extend from 'extend';
import events from '../util/events';
import strategy from '../util/strategy';
import directiveControllerFactory from '../util/directive-controller';
import {propertiesMap} from '../util/properties-builder';

export default function(config, t){

	// Check for Angular 2 style properties
	if(config.properties && Array.isArray(config.properties)){
		let binders = parseProperties(config.properties);
		let previous = componentWriter.get('properties', t);

		if(previous && typeof previous === 'object')
		{
			componentWriter.set('properties', extend(previous, binders), t);
		}
		else
		{
			componentWriter.set('properties', parseProperties(config.properties), t);
		}
	}
	else if(config.properties !== undefined){
		throw new TypeError('Component properties must be an array');
	}

	// events
	if(config.events && Array.isArray(config.events)){
		events.add(...config.events);
		componentWriter.set('events', parseProperties(config.events), t);
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

	if(ddo.controllerAs){
		ddo.bindToController = propertiesMap(ddo.properties);
	}
		
	ddo.controller = directiveControllerFactory(injects, target, ddo);

	ngModule.directive(name, () => ddo);
});
