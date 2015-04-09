import {Module} from '../module/module';
import annotate from '../util/annotate';

const type = 'service';

export const Service = t => {
	annotate(t, '$provider', { name : t.name, type })
};

Module.registerProvider(type, (provider, module) => {
	module.service(provider.$provider.name, provider);
});