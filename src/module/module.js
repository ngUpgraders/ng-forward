let _parsers = {};

class DecoratedModule{
	constructor(name, modules = false){
		this.name = name;

		if(modules)
		{
			this._module = angular.module(name, Module.moduleList(modules));
		}
		else
		{
			this._module = angular.module(name);
		}
	}

	add(...providers){
		for(let i = 0; i < providers.length; i++)
		{
			let parser = _parsers[providers[i].$provider.type];

			parser(providers[i], this._module);
		}
	}

	bootstrap(){
		if(! this.bundled ) this.bundle();


	}

	publish(){
		return this._module;
	}
}

function Module(...params){
	return new DecoratedModule(...params);
}

Module.moduleList = function(modules){
	let realModuleList = [];

	if(modules){
		for(let i = 0; i < modules.length; i++){
			if(modules[i].name)
			{
				realModuleList.push(modules[i].name);
			}
			else if(typeof modules[i] === 'string')
			{
				realModuleList.push(modules[i]);
			}
			else
			{
				throw new Error('Cannot create submodule: unknown module type');
			}
		}
	}

	return realModuleList;
}

Module.registerProvider = function(providerType, parser){
	_parsers[providerType] = parser;

}

Module.getParser = function(providerType){
	return _parsers[providerType];
}

export {Module};