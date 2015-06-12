import Module from '../../module';
import decoratorFactory from '../../util/decorator-factory';

const TYPE = 'controller';

export const Controller = decoratorFactory(TYPE);

Module.registerProvider(TYPE, (provider, name, injects, ngModule) => {
	ngModule.controller(name, [...injects, provider]);
});