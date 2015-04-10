import {Module} from '../module/module';
import annotate from '../util/annotate';
import each from 'foreach';

const type = 'injectable';
let uid = 52;
let injectables = [];

export const Injectable = t => {
	let name = `${t.name}Injectable${uid}`;
	++uid;

	annotate(Injectable, '$provider', {
		uid,
		type,
		name
	});

	injectables.push(name);
}

Module.registerProvider(type, (provider, module) => {
	function registerRequiredInjectables(...providers){
		each(providers, provider => {
			module.service(provider.$provider.name, provider);
		});
	};
});