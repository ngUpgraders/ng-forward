import {componentStore, bundleStore, providerStore} from '../writers';
import Module from '../classes/module';
import {Providers} from './providers';
import {componentHooks} from "./component";
import {createConfigErrorMessage} from '../util/helpers';
import {getInjectableName} from '../util/get-injectable-name';
import IState = ng.ui.IState;
import IStateProvider = ng.ui.IStateProvider;

const configsKey = 'ui-router.stateConfigs';
const childConfigsKey = 'ui-router.stateChildConfigs';
const annotatedResolvesKey = 'ui-router.annotatedResolves';
const resolvedMapKey = 'ui-router.resolvedMap';

export interface IComponentState extends IState {
    component: any;
}

/**
 *
 * @param stateConfigs an array of state config objects
 * @example
 *
 * // Assume we also had two other components: Inbox and Compose
 *
 * @Component({ selector: 'app', template: '<ui-view></ui-view>' })
 * @StateConfig([
 *   { name: 'inbox', url: '/', component: Inbox, resolve: ... },
 *   { name: 'compose', url: '/compose', component: Compose }
 * ])
 * class App {}
 */
export function StateConfig(stateConfigs: IComponentState[]){
    return function(t: any){
        // Add all routed components as providers to this parent component so they are included in the bundle
        Providers(...stateConfigs.map(sc => sc.component))(t, `while analyzing StateConfig '${t.name}' state components`);

        // Store the state configs in the parent component's metadata...
        componentStore.set(childConfigsKey, stateConfigs, t);

        // ...But also store each child's own config in that child component's metadata
        // currently not used, but might be useful in the future.
        stateConfigs.forEach(config => {
            if (!config.component) return;
            let existingConfigs = componentStore.get(configsKey, config.component) || [];
            componentStore.set(configsKey, [...existingConfigs, config], config.component);
        });
    }
}

function targetIsStaticFn(t) {
    return t.name !== undefined && t.constructor.name === 'Function';
}


/**
 *
 * @param resolveName if you'd like to rename the resolve, otherwise it will use the name of the static method
 * @example
 *
 * @Component({ selector: 'inbox', template: '...' })
 * // Don't forget to also inject your resolve into your constructor with another @Inject up here, use a string for resolves.
 * @Inject('messages')
 * class Inbox {
 *
 *   // The resolve function must be static. You can optionally inject with @Inject
 *   @Resolve()
 *   @Inject('$http')
 *   static messages($http) {
 *      return $http.get('/api/messages);
 *   }
 *
 *   constructor(public messages) { }
 * }
 *
 * @Component({ selector: 'app', template: '<ui-view></ui-view>' })
 * @StateConfig([
 *   { name: 'inbox', url: '/', component: Inbox. }
 * ])
 * class App {}
 */
export function Resolve(resolveName: string = null){
    return function(target: any, resolveFnName: string, {value: resolveFn}){
        if (!targetIsStaticFn(target)) {
            throw new Error('@Resolve target must be a static method.');
        }

        componentStore.merge(annotatedResolvesKey, {[resolveName || resolveFnName]: resolveFn}, target);
    }
}

componentHooks.extendDDO((ddo: any) => {
    if (ddo.template && ddo.template.replace) {
        // Just a little sugar... so folks can write 'ng-outlet' if they want
        ddo.template = ddo.template.replace(/ng-outlet/g, 'ui-view');
    }
});

componentHooks.after((target: any, name: string, injects: string[], ngModule: ng.IModule) => {
    const childStateConfigs: IComponentState[] = componentStore.get(childConfigsKey, target);

    if (childStateConfigs) {
        if (!Array.isArray(childStateConfigs)) {
            throw new TypeError(createConfigErrorMessage(target, ngModule, '@StateConfig param must be an array of state objects.'));
        }

        ngModule.config(['$stateProvider', function($stateProvider: IStateProvider) {
            if (!$stateProvider) return;

            childStateConfigs.forEach((config: IComponentState) => {
                // Grab tag name from component, use it to build a minimal state template
                const tagName = bundleStore.get('selector', config.component);
                config.template = config.template || `<${tagName}></${tagName}>`;

                // You can add resolves in two ways: a 'resolve' property on the StateConfig, or via
                // the @Resolve decorator. These lines handle merging of the two (@Resolve takes precedence)
                // Also if a resolve function needs to be injected with @Inject we make sure to add $inject
                // to that function so it works.
                const annotatedResolves = componentStore.get(annotatedResolvesKey, config.component) || {};
                Object.keys(annotatedResolves).forEach(resolveName => {
                    const resolveFn = annotatedResolves[resolveName];
                    const fnInjects = bundleStore.get('$inject', resolveFn);
                    resolveFn.$inject = fnInjects;
                });
                config.resolve = Object.assign({}, config.resolve, annotatedResolves);

                // Now grab all the @Inject-eds on the state component, map those injectables to
                // their injectable names (in case they aren't strings). Construct a state controller
                // that asks for those injected items. If any of them are resolves that will give us
                // the fully resolved values of those resolves. We create a map of the resolved values
                // and write the map as metadata on the state component. The map is then used below in
                // the beforeCtrlInvoke hook to add the resolved values as locals to our component's
                // constructor.
                const childInjects = bundleStore.get('$inject', config.component);
                const injects = childInjects ? childInjects.map(getInjectableName) : [];
                function stateController(...resolves): any {
                    const resolvedMap = resolves.reduce((obj, val, i) => {
                        obj[injects[i]] = val;
                        return obj;
                    }, {});
                    componentStore.set(resolvedMapKey, resolvedMap, config.component);
                }
                config.controller = config.controller || [...injects, stateController];

                // Now actually add the state to $stateProvider
                $stateProvider.state(config.name, config);
            });
        }]);
    }
});

componentHooks.beforeCtrlInvoke((caller: any, injects: string[], controller: any, ddo: any, $injector: any, locals: any) => {
    // Here we just grab the already resolved values and add them as locals before the component's
    // controller is invoked
    const resolvesMap = componentStore.get(resolvedMapKey, controller);
    Object.assign(locals, resolvesMap);
});


