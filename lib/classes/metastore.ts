export default class Metastore{
	constructor(private namespace:string){
		
	}
	
	private _map(obj: any, key?: string): Map<any,any>{
		if(!Reflect.hasOwnMetadata(this.namespace, obj, key)){
			Reflect.defineMetadata(this.namespace, new Map(), obj, key);
		}
		
		return Reflect.getOwnMetadata(this.namespace, obj, key);
	}
	
	get(key: any, obj: any, prop?: string): any{
		return this._map(obj, prop).get(key);
	}
	
	set(key: any, value: any, obj: any, prop?: string){
		this._map(obj, prop).set(key, value);
	}
	
	has(key: any, obj: any, prop?: string): boolean{
		return this._map(obj, prop).has(key);
	}
	
	push(key: any, value: any, obj: any, prop?: string){
		if(!this.has(key, obj, prop)){
			this.set(key, [], obj, prop);
		}
		
		let store = this.get(key, obj, prop);
		
		if(!Array.isArray(store)){
			throw new Error('Metastores can only push metadata to array values');
		}
		
		store.push(value);
	}

	merge(key: any, value: any, obj: any, prop?: string) {
		let previous = this.get(key, obj, prop) || {};
		let mergedObj = Object.assign({}, previous, value);
        this.set(key, mergedObj, obj, prop);
	}
	
	forEach(callbackFn: (value: any, index: any, map: Map<any, any>) => void, obj: any, prop?: string){
		this._map(obj, prop).forEach(callbackFn);
	}
}