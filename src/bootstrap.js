/*global angular,document */
import bundle from './bundle';
import appWriter from './writers';

export default function bootstrap(component, otherProviders = []){
  let selector = appWriter.get('selector', component);
  bundle(selector, component, otherProviders);
  angular.bootstrap(document.querySelector(selector), [selector]);
}
