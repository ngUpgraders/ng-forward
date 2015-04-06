let _parsers = {};

export class Module{
	constructor(name, modules = false){
		this.name = name;

		if(modules)
		{
			this._module = angular.module(name, modules);
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

	static moduleList(modules){
		let realModuleList = [];

		if(modules){
			for(let i = 0; i < modules.length; i++){
				if(modules[i].name)
				{
					realModuleList.push(modules[i].name);
				}
				else if(typeof modules[i] == 'string')
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

	static registerProvider(providerType, parser){
		_parsers[providerType] = parser;
	
	}

	static getParser(providerType){
		return _parsers[providerType];
	}
}