import {providerStore} from '../writers';

const randomInt = () => Math.floor(Math.random() * 100);

interface UniqueNameDecorator{
	(maybeT: any): any;
	clearNameCache(): void;
}

export default function(type: string, strategyType: string = 'provider'): UniqueNameDecorator{
	let names = new Set();

	function createUniqueName(name:string): string{
		if( names.has(name) ) {
			return createUniqueName(`${name}${randomInt()}`);
		} else {
			return name;
		}
	};

	const NAME_TAKEN_ERROR = (name:string) : Error => {
		return new Error(`A provider with type ${type} and name ${name} has already been registered`);
	};

	// Return the factory
	return ((): UniqueNameDecorator => {
		let d: any = function(maybeT: any) : any{
			const writeWithUniqueName = (t: any) : void => {
				let name = createUniqueName(t.name);
				providerStore.set('type', type, t);
				providerStore.set('name', name, t);
				names.add(name);
			};
	
			if (typeof maybeT === 'string') {
				if(names.has(maybeT)) {
					throw NAME_TAKEN_ERROR(maybeT);
				}
	
				return (t: any) : void => {
					providerStore.set('type', type, t);
					providerStore.set('name', maybeT, t);
					names.add(maybeT);
				};
			}
			else if (maybeT === undefined) {
				return (t: any) : void => writeWithUniqueName(t);
			}
			
			writeWithUniqueName(maybeT)
		};
		
		d.clearNameCache = () => names.clear();
		
		return d;
	})();
};
