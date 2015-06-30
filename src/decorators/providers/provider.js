import Module from '../../module';
import decoratorFactory from '../../util/decorator-factory';

const TYPE = 'provider';

export const Provider = decoratorFactory(TYPE);

Module.registerProvider(TYPE, (provider, name, injects, ngModule) => {
	ngModule.provider(name, [...injects, provider]);
});