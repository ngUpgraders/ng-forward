/* global Object */
// # Directive Controller Factory
// While we want to use the component controller, we need a way to add our own
// properties to the controller instance before the constructor is called. We also
// want to do this in the context of Angular's DI so that we can access the $element
// for events and $filter for properties.
//
// ## Setup
// We'll need a1atscript's inputsBuilder for generating the property definitions
import {inputsBuilder} from './inputs-builder';
// Also need the outputsBuilder for creating event emitters
import outputsBuilder from './outputs-builder';
// Finally extend for extending the instance of the controller
import extend from 'extend';

// ## Factory
// Needs the injection array, the controller class, and the directive definition
// object in order to generate the controller
export default function createDirectiveController(caller, injects, controller, ddo, $injector, locals){
  // Create an instance of the controller without calling its constructor
  let instance = Object.create(controller.prototype);
  // Use a1atscript's inputsBuilder to add the getters/setters then sugar
  // over `=` and `@` bindings
  for(let key in ddo.inputMap) {
    inputsBuilder(instance, key, ddo.inputMap[key]);
  }
  // Remember, angular has already set those bindings on the `caller`
  // argument. Now we need to extend them onto our `instance`. It is important
  // to extend after defining the properties. That way we fire the setters.
  extend(instance, caller);

  // Finally, invoke the constructor using the injection array and the captured
  // locals
  $injector.invoke([...injects, controller], instance, locals);

  // Outputs work similarly, but they need the raw $element and the $scope for
  // destroying output observables.
  let {$element, $scope} = locals;
  outputsBuilder(instance, $element[0], $scope, ddo.outputMap || {});

  // Return the controller instance
  return instance;
}
