import Module from '../../module';
import decoratorFactory from '../../util/decorator-factory';

const TYPE = 'service';

export const Service = decoratorFactory(TYPE);

Module.addProvider(TYPE, (provider, name, injects, ngModule) => {
	ngModule.service(name, [...injects, provider]);
});