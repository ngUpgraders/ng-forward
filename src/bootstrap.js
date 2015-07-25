/*global angular,document */
import {appWriter} from './writers';
import Module from './module';

export default function bootstrap(component){
  let directives = [component];
  let modules = [];
  let providers = [];

  function parseTree(component){
    let innerDirectives = appWriter.get('directives', component) || [];
    directives.push(...innerDirectives);
    innerDirectives.forEach(parseTree);

    let innerModules = appWriter.get('modules', component) || [];
    modules.push(...innerModules);

    let innerProviders = appWriter.get('providers', component) || [];
    providers.push(...innerProviders);
  }

  parseTree(component);
  let selector = appWriter.get('selector', component);
  Module(selector, modules).add(...directives, ...providers);

  angular.bootstrap(document.querySelector(selector), [selector]);
}
