import {Module} from '../module/module';
import annotate from '../util/annotate';

export const Controller = t => {
	annotate(t, '$provider', {
		name : t.name,
		type : 'controller'
	});
}

Module.registerProvider('controller', (provider, module) => {
	module.controller(provider.$provider.name, provider);
});