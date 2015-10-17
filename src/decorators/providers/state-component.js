// # @StateComponent
// A routeable component designed for ui-router

import {componentWriter, providerWriter} from '../../writers';
import {Providers} from '../Providers';
import Module from '../../module';

export const StateComponent = (name, config = {}) => t => {
  let controllerAs = name
    .split(/(\ |\-|\_|\.)/g)
    .map((part, index) => {
      if(index === 0){
        return part.toLowerCase();
      }
      else{
        return `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}`;
      }
    })
    .join('');

  componentWriter.set('controllerAs', controllerAs, t);

  for(let key in config){
    componentWriter.set(key, config[key], t);
  }

  if(componentWriter.has('children', t)){
    let children = componentWriter.get('children', t);
    Providers(...children)(t);
    componentWriter.delete('children', t);
  }

  if(componentWriter.has('bindings', t)){
    let bindings = componentWriter.get('bindings', t);
    Providers(...bindings)(t);
    componentWriter.delete('bindings', t);
  }

  providerWriter.set('name', name, t);
  providerWriter.set('type', 'state-component', t);
};


Module.addProvider('state-component', (provider, name, injects, ngModule) => {
  ngModule.config(['$stateProvider', '$locationProvider', ($stateProvider, $locationProvider) => {
		$locationProvider.html5Mode({ enabled: true, requireBase: false });
		$locationProvider.hashPrefix('!');
    let config = {};

    componentWriter.forEach((val, key) => config[key] = val, provider);

    config.controller = [...injects, provider];

    $stateProvider.state(name, config);
  }]);
});
