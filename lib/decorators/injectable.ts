import Module from '../classes/module';
import decoratorFactory from '../util/decorator-factory';

export const INJECTABLE = 'injectable';

export const Injectable: (any?: any) => any = decoratorFactory(INJECTABLE);

Module.addProvider(INJECTABLE, (provider: any, name: string, injects: string[], ngModule: ng.IModule) => {
	ngModule.service(name, [...injects, provider]);
});
