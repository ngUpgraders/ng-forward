/*global angular,document,global*/
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
import {bundleStore} from './writers';

// ## Bootstrap
export default function bootstrap(component: any, otherProviders: any[] = []): any{
  // Selector of the root component. In the above example, this would be `app`
  let selector = bundleStore.get('selector', component);
  // The actual element we'll be using to bootstrap the application
  let rootElement = document.querySelector(selector);
  // Create our bundle from the root component. Note that the name of this
  // module is also going to be the selector of the root component
  bundle(selector, component, otherProviders);

  return angular.bootstrap(rootElement, [selector]);
}
