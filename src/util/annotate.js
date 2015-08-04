export let a = {};

class A{
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
	Object.defineProperty(A.prototype, name, {
		get: function(){
			this.decorators.push(decorator);
			return this;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(a, name, {
		get: function(){
			return (new A())[name];
		},
		enumerable: true,
		configurable: true
	});
};

export const registerFactory = (name, decoratorFactory) => {
	A.prototype[name] = function(...params){
		this.decorators.push(decoratorFactory(...params));
		return this;
	};

	a[name] = function(...params){
		return (new A())[name](...params);
	};
};
