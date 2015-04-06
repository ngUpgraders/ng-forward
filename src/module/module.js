let _parsers = {};

export class Module{
	constructor(name, modules){
		this.$es6 = true;
		this.name = name;
		this.modules = Module.moduleList(modules);
		this.providers = [];
		this.bundled = false;
	}

	register(...providers){
		if(! this.bundled )
		{
			this.providers.push(...providers);
		}
		else
		{
			throw new Error(`${this.name} has already been bundled`);
		}

		return this;
	}

	publish(){
		return this.bundle();
	}

	bundle(){
		if(! this.bundled )
		{
			let module = angular.module(this.name, this.modules);
			console.log(this.providers);

			for(let i = 0; i < this.providers.length; i++)
			{

				let parser = _parsers[this.providers[i].$provider.type];

				parser(this.providers[i], module);
			}

			this.bundled = true;

			return module;
		}
		else
		{
			throw new Error(`${this.name} has already been bundled`);
		}
	}

	bootstrap(){
		if(! this.bundled ) this.bundle();


	}

	static addToExisting(module, ...providers){
		for(let i = 0; i < providers.length; i++)
		{
			let parser = _parsers[providers[i].$provider.type];

			parser(providers[i], module);
		}

		return module;
	}

	static moduleList(modules){
		let realModuleList = [];

		if(modules){
			for(let i = 0; i < modules.length; i++){
				if(modules[i].$es6)
				{
					let bundled = modules[i].bundle();

					realModuleList.push(bundled.name);
				}
				else if(modules[i].name)
				{
					realModuleList.push(module.name);
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