/* global Object */
// # Directive Controller Factory
// While we want to use the component controller, we need a way to add our own
// properties to the controller instance before the constructor is called. We also
// want to do this in the context of Angular's DI so that we can access the $element
// for events and $filter for properties.
//
// ## Setup
// We'll need a1atscript's propertiesBuilder for generating the property definitions
import {propertiesBuilder} from './properties-builder';
// Also need the eventsBuilder for creating event emittors
import eventsBuilder from './events-builder';
// Finally extend for extending the instance of the controller
import extend from 'extend';

// ## Factory
// Needs the injection array, the controller class, and the directive definition
// object in order to generate the controller
export default function directiveControllerFactory(injects, controller, ddo){
  return [
    // Angular provides all of these as locals when it instantiates the controller
    // (excpet for `$injector`). We need to capture them so that we can re-provide
    // them as locals when we actually instantiate the real controller.
    '$element', '$scope', '$attrs', '$transclude', '$injector',
    // It is important to note that Angular will use the prototype of this function
    // to add properties from `bindToController`.
    function($element, $scope, $attrs, $transclude, $injector){
      // Create an instance of the controller without calling its constructor
      let instance = Object.create(controller.prototype);
      // Use a1atscript's propertiesBuilder to add the getters/setters than sugar
      // over `=` and `@` bindings
      for(let key in ddo.properties){
        propertiesBuilder(instance, key, ddo.properties[key]);
      }
      // Remember, angular has alrady set those bindings on the prototype of our
      // generated function. Now we need to extend them onto our instance. important
      // to extend after building the properties that way we fire the setters
      extend(instance, this);

      // Finally, invoke the constructor using the injection array and the captured
      // locals
      $injector.invoke([...injects, controller], instance, {
        $element,
        $scope,
        $attrs,
        $transclude
      });

      // Events work similarly, but they need the raw $element and the $scope for
      // destroying event observables.
      eventsBuilder(instance, $element[0], $scope, ddo.events || {});

      // Return the controller instance
      return instance;
    }
  ];
}
