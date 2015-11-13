import {componentStore, bundleStore, providerStore} from '../writers';
import Module from '../classes/module';
import {Providers} from './providers';
import IState = ng.ui.IState;

export let uiRouterChildConfigsStoreKey = 'ui-router.stateChildConfigs';
export let uiRouterConfigsStoreKey = 'ui-router.stateConfigs';
export let uiRouterResolvedMapStoreKey = 'ui-router.resolvedMap';

export interface IComponentState extends IState {
    component: any;
    path: string;
    as: string;
    redirect: string;
}

export function StateConfig(stateConfigs: IComponentState[]){
    return function(t: any){
        Providers(...stateConfigs.map(sc => sc.component))(t, `while analyzing StateConfig '${t.name}' state components`);
        componentStore.set(uiRouterChildConfigsStoreKey, stateConfigs, t);
        stateConfigs.forEach(config => {
            if (!config.component) return;
            let existingConfigs = componentStore.get(uiRouterConfigsStoreKey, config.component) || [];
            componentStore.set(uiRouterConfigsStoreKey, [...existingConfigs, config], config.component);
        });
    }
}

