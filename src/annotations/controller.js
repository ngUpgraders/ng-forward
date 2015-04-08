import {Module} from '../module/module';

export const Controller = t => {
	t.$provider = t.$provider || {};

	t.$provider.name = t.name;
	t.$provider.type = 'controller';
}

Module.registerProvider('controller', (provider, module) => {
	module.controller(provider.$provider.name, provider);
});