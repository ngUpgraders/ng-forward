import {Module} from '../module/module';
import annotate from '../util/annotate';

const type = 'provider';

export const Provider = t => {
	annotate(t, '$provider', { name : t.name, type });
};

Module.registerProvider(type, (provider, module) => {
	module.provider(provider.$provider.name, provider)
});