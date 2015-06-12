import {Module} from '../module/module';
import annotate from '../util/annotate';

const type = 'service';

export const Service = maybeT => {
	if(typeof maybeT === 'string')
	{
		return t => {
			annotate(t, '$provider', { name : maybeT, type });
		}
	}
	else
	{
		annotate(maybeT, '$provider', { name : maybeT.name, type });
	}
};

Module.registerProvider(type, (provider, module) => {
	module.service(provider.$provider.name, provider);
});