export default class Decorator{
	private factories: ((any) => any)[] = [];
	
	static addDecorator(name: string, decorator: (...any) => (any) => any){
		if(Decorator.prototype[name]){
			delete Decorator.prototype[name];
		}
		
		Object.defineProperty(Decorator.prototype, name, {
			writable: false,
			configurable: true,
			enumerable: true,
			value: function(...params){
				this.factories.push(decorator(...params));
				
				return this;
			}
		});
	}
	
	class(definition: any = {}): any{
		let copy = Object.assign({
			constructor: function(){}
		}, definition);
		
		for(let prop of Object.getOwnPropertyNames(definition)){
			let descriptor = Object.getOwnPropertyDescriptor(definition, prop);
			Object.defineProperty(copy.constructor.prototype, prop, descriptor);
		}
		
		this.factories.forEach(factory => factory(copy.constructor));
		
		return copy.constructor;
	}
}