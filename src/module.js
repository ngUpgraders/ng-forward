import {baseWriter, providerWriter} from './writers';

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
		for(let provider of providers)
		{
			if( !providerWriter.has('type', provider) ){
				throw new Error(`Cannot read provider metadata. Are you adding a class that hasn't been decorated yet?`);
			}

			let type = providerWriter.get('type', provider);
			let name = providerWriter.get('name', provider);
			let inject = baseWriter.get('$inject', provider) || [];

			if(_parsers[type]){
				_parsers[type](provider, name, inject, this._module);
			}
			else{
				throw new Error(`No parser registered for type '${type}'`);
			}
		}

		return this;
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

	config(configFunc){
		this._module.config(configFunc);

		return this;
	}

	run(runFunc){
		this._module.run(runFunc);

		return this;
	}
}

function Module(...params){
	return new DecoratedModule(...params);
}

Module.addProvider = function(providerType, parser){
	_parsers[providerType] = parser;
}

Module.getParser = function(providerType){
	return _parsers[providerType]
}

export default Module;