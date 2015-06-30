import Module from '../module';
import {componentWriter} from '../writers';
import parseProperties from './parse-properties';

export default function(config, t){
	// Support for legacy angular-decorators bind config
	if(config.bind){
		componentWriter.set('scope', config.bind, t);
		componentWriter.set('bindToController', true, t);
	}

	// Check for scope
	if(config.scope){
		componentWriter.set('scope', config.scope, t);
	}


	// Check for Angular 2 style properties
	if(config.properties && Array.isArray(config.properties)){
		componentWriter.set('bindToController', parseProperties(config.properties), t);
	}
	else if(config.properties !== undefined){
		throw new TypeError('Component properties must be an array');
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
}

Module.registerProvider('directive', (target, name, injects, ngModule) => {
	let ddo = {};

	componentWriter.forEach((val, key) => {
		ddo[key] = val;
	}, target);

	ddo.controller = [...injects, target];

	ngModule.directive(name, () => ddo);
});
