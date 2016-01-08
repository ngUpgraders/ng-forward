// # Module
// A thin wrapper around `angular.module` for transforming annotated classes into
// angular providers
//
// ## Setup
// Unless you are using a shim, all official distributions of Angular.js install
// `angular` on `window`. It is safe to assume it will always be there.
/* global angular */
// The core of the module system relies on special metadata writers. They write
// namespaced metadata to a class. Each writer is responsible for handling some
// subset of useful information
import {bundleStore, providerStore} from '../writers';
import {Provider} from "./provider";

// A very simple map holding the parsers for each provider. More on this later.
let _parsers: any = {};

// ## DecoratedModule class
// Define the Module wrapper class.
export class DecoratedModule{
	private _module: ng.IModule;
	private _dependencies: any[];
	
	constructor(public name: string, modules: any = false){
		// `angular.module` works either by creating a new module via an array
		// of dependencies or by reference without the dependencies array
		if(modules)
		{
			// parse the module list to create an array of just strings
			this.moduleList(modules);
			// Create the angular module.
			this._module = angular.module(name, this._dependencies);
		}
		else
		{
			// If no dependencies were passed, access the module by reference
			this._module = angular.module(name);
		}
	}

	// This is where you add an annotated class to the Angular module
	add(...providers: any[]): DecoratedModule {
		// We used a rest parameter so that you can add multiple providers at once.
		// So we must iterate over our array of providers.

		const providersInferred = providers.filter(p => !p.isProvider);
		const providersProper = providers.filter(p => p.isProvider);

		const handleProvider = provider => {
			// The providerStore contains the type of provider the class will be transformed
			// into as well as the name of the eventual provider. If this information has
			// not been set on the class, then we aren't dealing with a decorated class.
			if( !providerStore.has('type', provider) ){
				throw new Error(`Cannot read provider metadata. Are you adding a class that hasn't been decorated yet?`);
			}

			// Grab the type of provider
			let type = providerStore.get('type', provider);
			// ...and the name of the provider
			let name = providerStore.get('name', provider);
			// This is the injection array used by angular's `$injector.invoke`. This array
			// is just a list of strings that will be injected
			let inject = bundleStore.get('$inject', provider) || [];

			// We use the provider type to determine which parser will handle the class
			if(_parsers[type]){
				// Execute the parser passing the class, name of the provider, injection
				// array, and the raw `angular.module` we defined in the constructor.
				_parsers[type](provider, name, inject, this._module);
			}
			else{
				throw new Error(`No parser registered for type '${type}'`);
			}
		};

		providersInferred.forEach(handleProvider);
		providersProper.forEach(handleProvider);

		return this;
	}

	// Dead code from angular-decorators that should probably be removed. Just returns
	// the raw angular.module.
	publish(): ng.IModule{
		return this._module;
	}

	// Parses the array of modules
	moduleList(modules: any[]){
		// Setup the dependency array
		this._dependencies = [];

		if(modules && modules.length !== 0){
			// Iterate over the modules. Would be better done via `modules.map`, but
			// it works.
			for(let i = 0; i < modules.length; i++)
			{
				// If the module is a string (i.e. 'ui-router' or 'ngAria') then we are
				// already set
				if(typeof modules[i] === 'string')
				{
					this._dependencies.push(modules[i]);
				}
				// If it isn't a string but has a name then use the name instead. Raw
				// `angular.module`s provide the name here as does our reimplementation.
				else if(modules[i] && modules[i].name)
				{
					this._dependencies.push(modules[i].name);
				}
				// If neither case was met, throw an error
				else
				{
					throw new Error(`Cannot read module: Unknown module in ${this.name}`);
				}
			}
		}
	}

	// Alias over the raw config function
	config(configFunc: any): DecoratedModule{
		this._module.config(configFunc);

		return this;
	}

	// Alias over the raw run function
	run(runFunc: any): DecoratedModule{
		this._module.run(runFunc);

		return this;
	}

	// Alias for the value provider
	value(name: string, value: any): DecoratedModule{
		this._module.value(name, value);

		return this;
	}

	// Alias for the constant provider
	constant(name: string, value: any): DecoratedModule{
		this._module.constant(name, value);

		return this;
	}
}

// Becuase I determined `export default new Module` to be too long, wrap the
// `DecoratedModule` class in a simple factory function.
let Module: any = function(name: string, modules?: any): DecoratedModule{
	return new DecoratedModule(name, modules);
};

// A static function for adding new parsers. You pass it a type like 'factory' and
// a parsing function. This parsing function is what is called in the `DecoratedModule.add`
// function
Module.addProvider = function(providerType: string, parser: any){
	_parsers[providerType] = parser;
};

// Retrieve a parser. Only useful for tests and checking if a parser has already been
// set
Module.getParser = function(providerType: string): any{
	return _parsers[providerType];
};

// ## Conclusion
// Finally export module
export default Module;
