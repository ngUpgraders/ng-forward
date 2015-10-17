import Module from '../../module';
import decoratorFactory from '../../util/decorator-factory';

export const INJECTABLE = 'injectable';

export const Injectable = decoratorFactory(INJECTABLE);

Module.addProvider(INJECTABLE, (provider, name, injects, ngModule) => {
	ngModule.service(name, [...injects, provider]);
});