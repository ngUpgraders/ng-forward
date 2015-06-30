export let d = {};

class D{
	constructor(){
		this.decorators = [];
	}

	for(target){
		for(let i = 0; i < this.decorators.length; i++)
		{
			if(typeof this.decorators[i] !== 'function')
			{
				throw new TypeError(`Decorator ${i + 1} did not produce a function`);
			}

			this.decorators[i](target);
		}

		this.decorators = [];
	}
}

export const register = (name, decorator) => {
	Object.defineProperty(D.prototype, name, {
		get: function(){
			this.decorators.push(decorator);
			return this;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(d, name, {
		get: function(){
			return (new D())[name];
		},
		enumerable: true,
		configurable: true
	});
};

export const registerFactory = (name, decoratorFactory) => {
	D.prototype[name] = function(...params){
		this.decorators.push(decoratorFactory(...params));
		return this;
	};

	d[name] = function(...params){
		return (new D())[name](...params);
	};
};
