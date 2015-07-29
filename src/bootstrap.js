/*global angular,document,global,zone */
import bundle from './bundle';
import {appWriter} from './writers';

export default function bootstrap(component, otherProviders = []){
  let ngZone;
  let selector = appWriter.get('selector', component);
  let rootElement = document.querySelector(selector);
  bundle(selector, component, otherProviders);

  if(global.zone){
    ngZone = zone.fork({
      afterTask: () => {
        let $rootScope = angular.element(rootElement).scope();
        if($rootScope && !$rootScope.$$phase){
          $rootScope.$digest();
        }
      }
    });
  }

  if(ngZone){
    ngZone.run(() => angular.bootstrap(rootElement, [selector]));
  }
  else{
    angular.bootstrap(rootElement, [selector]);
  }
}
