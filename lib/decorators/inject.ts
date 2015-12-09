// # Inject Decorator
// Decorator for adding dependencies to a provider
//
// ## Usage
// Inject string-based dependencies, decorated classes, or classes directly as services
// ```js
// import {Inject} from 'ng-forard';
//
// class SomeService{ }
//
// @Inject('$q', SomeService)
// class AnotherService{ }
// ```
//
// Import the appWriter for reading and writing metadata
import {bundleStore, providerStore} from '../writers';
import {getInjectableName} from '../util/get-injectable-name';
import {Providers} from '../decorators/providers';
import {OpaqueToken} from '../classes/opaque-token';
import {componentHooks} from './component';

// ## @Inject
// Takes an array of injects
export function Inject( ...injects: any[] ){
	return function(t1:any, name?: string, {value: t2} = {value: undefined}){

		// We can use @Inject on classes and--in the case of ui-router @Resolve decorator--static methods.
		// If we use @Inject on a static method then 3 arguments are passed in, instead of just 1.
		const targetIsClass = arguments.length === 1;
		const t = targetIsClass ? t1 : t2;

		const notStringBased = (inj: any) => typeof inj !== 'string' && !(inj instanceof OpaqueToken);
		const ensureInjectable = (inj: any) => {
			if (!providerStore.get('name', inj) || !providerStore.get('type', inj)) {
				throw new Error(`Processing "${t.name}" @Inject parameter: "${inj.name || inj.toString()}" is not a valid injectable.
				Please ensure ${inj.name || inj.toString()} is injectable. Valid examples can be:
				- a string representing an ng1 provider, e.g. '$q'
				- an @Injectable ng-forward class
				- a Provider, e.g. provide(SOME_CONFIG, {asValue: 100})`)
			}
			return inj;
		};


		// At the end of the day, Angular 1's DI requires the injection array to be
		// an array of strings. Map over the injects to get the string provider name for
		// each injectable

		var providers = injects
				.filter(notStringBased)
				.map(ensureInjectable);

		Providers(...providers)(t, `while analyzing '${t.name}' injected providers`);

		let dependencies = injects.map(getInjectableName).filter(n => n !== undefined);

		// If there is already an $inject array, assume that it was set by a parent class.
		// The resultant $inject array should be a concat of local dependencies and parent
		// injects.
		// ```js
		// @Inject('$q', '$http', '$interval')
		// class Parent{ ... }
		//
		// @Inject('$timeout')
		// class Child extends Parent{
		// 	constructor($timeout, ...parentDependencies){
		// 		super(...parentDependencies);
		// 	}
		// }
		// ```
		if (bundleStore.has('$inject', t)) {
			let parentInjects = bundleStore.get('$inject', t);
			bundleStore.set('$inject', [...dependencies, ...parentInjects], t);
		}
		// Otherwise just use the dependencies array as the $inject array.
		else {
			bundleStore.set('$inject', dependencies, t);
		}
	}
}

componentHooks.beforeCtrlInvoke(injectParentComponents);

// Checks every injection if it is known to the $injector
// It will then check the unknown injects if there is any parent component that matches
// the name. If a matching component was found it will inject that component as a
// local.
function injectParentComponents(caller: any, injects: string[], controller: any, ddo: any, $injector: any, locals: any) {
	injects.forEach((inject) => {
		if (!$injector.has(inject)) {
			let parent = locals.$element;

			do {
				if (!parent.controller) continue;
				const parentCtrl = parent.controller(inject);
				if (parentCtrl) {
					locals[inject] = parentCtrl;
					return;
				}
			} while ((parent = parent.parent()) && parent.length > 0);
		}
	});
}
