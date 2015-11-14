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
const resolvedMapKey = 'ui-router.resolvedMap';

export interface IComponentState extends IState {
    component: any;
}

export function StateConfig(stateConfigs: IComponentState[]){
    return function(t: any){
        Providers(...stateConfigs.map(sc => sc.component))(t, `while analyzing StateConfig '${t.name}' state components`);
        componentStore.set(childConfigsKey, stateConfigs, t);
        stateConfigs.forEach(config => {
            if (!config.component) return;
            let existingConfigs = componentStore.get(configsKey, config.component) || [];
            componentStore.set(configsKey, [...existingConfigs, config], config.component);
        });
    }
}

componentHooks.extendDDO.push((ddo: any) => {
    if (ddo.template && ddo.template.replace) {
        ddo.template = ddo.template.replace(/ng-outlet/g, 'ui-view');
    }
});

componentHooks.beforeCtrlInvoke.push((caller: any, injects: string[], controller: any, ddo: any, $injector: any, locals: any) => {
    const resolvesMap = componentStore.get(resolvedMapKey, controller);
    Object.assign(locals, resolvesMap);
});

componentHooks.after.push((target: any, name: string, injects: string[], ngModule: ng.IModule) => {
    const childStateConfigs: IComponentState[] = componentStore.get(childConfigsKey, target);

    if (childStateConfigs) {
        if (!Array.isArray(childStateConfigs)) {
            throw new TypeError(createConfigErrorMessage(target, ngModule, '@StateConfig param must be an array of state objects.'));
        }

        ngModule.config(['$stateProvider', function($stateProvider: IStateProvider) {
            if (!$stateProvider) return;

            childStateConfigs.forEach((config: IComponentState) => {
                const tagName = providerStore.get('name', config.component);
                const childInjects = bundleStore.get('$inject', config.component);
                const injectedResolves = childInjects ? childInjects.map(getInjectableName) : [];

                function stateController(...resolves): any {
                    const resolvedMap = resolves.reduce((obj, val, i) => {
                        obj[injectedResolves[i]] = val;
                        return obj;
                    }, {});
                    componentStore.set(resolvedMapKey, resolvedMap, config.component);
                }

                config.controller = [...injectedResolves, stateController];
                config.template = config.template || `<${tagName}></${tagName}>`;
                $stateProvider.state(config.name, config);
            });
        }]);
    }
});


