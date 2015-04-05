let _parsers = {};

export class Module{
	constructor(name, ...modules){
		this.$es6 = true;
		this.name = name;
		this.modules = Module.moduleList(...modules);
		this.providers = [];
		this.bundled = false;
	}

	register(...providers){
		if(! this.bundled )
		{
			this.providers.concat(providers);
		}
		else
		{
			throw new Error(`${this.name} has already been bundled`);
		}
	}

	bundle(){
		if(! this.bundled )
		{
			let module = angular.module(this.name, this.modules);

			for(provider in this.providers)
			{
				_parsers[provider.$provider.type](provider, module);
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

	static moduleList(...modules){
		let realModuleList = [];

		for(module in modules){
			if(module.$es6)
			{
				let bundled = module.bundle();

				realModuleList.push(bundled.name);
			}
			else if(module.name)
			{
				realModuleList.push(module.name);
			}
			else if(typeof module == 'string')
			{
				realModuleList.push(module);
			}
			else
			{
				throw new Error('Cannot create submodule: unknown module type');
			}
		}

		return realModuleList;
	}

	static registerProvider(providerType, parser){
		_parsers[providerType] = parser;
	}
}