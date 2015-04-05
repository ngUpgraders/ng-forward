import {Module} from '../module/module';

export function ProviderParser(providerType){
	return function(target){
		Module.registerProvider(providerType, target);
	}
}