let _parsers = {};

class DecoratedModule{
	constructor(name, modules = false){
		this.name = name;
		this.moduleList(modules);

		if(modules)
		{
			this._module = angular.module(name, this._dependencies);
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

		return this;
	}

	bootstrap(){
		if(! this.bundled ) this.bundle();
	}

	publish(){
		return this._module;
	}

	moduleList(modules){
		this._dependencies = [];

		if(modules && modules.length !== 0){
			for(let i = 0; i < modules.length; i++)
			{
				if(modules[i] && modules[i].name)
				{
					this._dependencies.push(modules[i].name);
				}
				else if(typeof modules[i] === 'string')
				{
					this._dependencies.push(modules[i]);
				}
				else
				{
					throw new Error(`Cannot read module: Unknown module in ${this.name}`);
				}
			}
		}
	}
}

function Module(...params){
	return new DecoratedModule(...params);
}

Module.registerProvider = function(providerType, parser){
	_parsers[providerType] = parser;
}

Module.getParser = function(providerType){
	return _parsers[providerType];
}

export {Module};