/*global angular,document,global,zone */
// # Bootstrap function
// Provides sugar over the bundle function and actually bootstrapping the application.
//
// ## Usage
// Just like Angular 2, create a root component and use bootstrap to kick it off:
// ```js
// import {Component, View, bootstrap} from 'ng-forward';
//
// @Component({
//   selector: 'app',
//   bindings: ['ui-router', 'ngAria', MyService]
// })
// @View({
//   template: 'Hello, world!',
//   directives: [/* Add components/directives here */]
// })
// class App{ }
//
// bootstrap(App);
// ```
// HTML:
// ```js
// <html>
// <body>
//   <app></app> <!-- app will be bootstrapped here -->
// </body>
// </html>
// ```
//
// ## Intro
// We'll need the bundle function to create our bundle from the root component
import bundle from './bundle';
// We'll need the appWriter to get the selector metadata off of the root component
import {appWriter} from './writers';

// ## Bootstrap 
export default function bootstrap(component, otherProviders = []){
  // Holder for a potential zone
  let ngZone;
  // Selector of the root component. In the above example, this would be `app`
  let selector = appWriter.get('selector', component);
  // The actual element we'll be using to bootstrap the application
  let rootElement = document.querySelector(selector);
  // Create our bundle from the root component. Note that the name of this
  // module is also going to be the selector of the root component
  bundle(selector, component, otherProviders);

  // This is still early proof of concept code for using zone.js for change
  // detection
  if(global.zone){
    // If you've imported zone.js into your project, create a new zone
    ngZone = zone.fork({
      afterTask: () => {
        // After some task has been completed, get the $rootScope off of the element
        // we used to bootstrap the application. Then, if a $digest cycle has not
        // already started kick one off. This lets you use ES6 Promises instead of $q
        // as well as a whole host of vanilla async stuff (setTimeout, setInterval, fetch, etc)
        let $rootScope = angular.element(rootElement).scope();
        if($rootScope && !$rootScope.$$phase){
          $rootScope.$digest();
        }
      }
    });
  }

  let injector;
  // If we were able to create the ngZone, bootstrap the app in the context of the
  // zone
  if(ngZone){
    injector = ngZone.run(() => angular.bootstrap(rootElement, [selector]));
  }
  // Otherwise, bootstrap it as normal
  else{
    injector = angular.bootstrap(rootElement, [selector]);
  }

  // return the injector but with get overridden to provide some sugar for 'getting'
  // component class controller instances
  return { ...injector,
    get: (service) => {
      if (angular.isFunction(service)) {
        let selector = appWriter.get('selector', service);
        service = `${selector}Directive`;
      }
      return injector.get(service);
    }
  }
}
