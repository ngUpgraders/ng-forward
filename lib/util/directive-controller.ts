/* global Object */
// # Directive Controller Factory
// While we want to use the component controller, we need a way to add our own
// properties to the controller instance before the constructor is called. We also
// want to do this in the context of Angular's DI so that we can access the $element
// for events and $filter for properties.
//
// ## Setup
// We'll need a1atscript's inputsBuilder for generating the property definitions
import inputsBuilder from '../properties/inputs-builder';
// Also need the outputsBuilder for creating event emitters
import outputsBuilder from '../properties/outputs-builder';
import {componentHooks} from '../decorators/component';

// ## Factory
// Needs the injection array, the controller class, and the directive definition
// object in order to generate the controller
export default function(caller: any, injects: string[], controller: any, ddo: any, $injector: any, locals: any): any{
  // Create an instance of the controller without calling its constructor
  let instance = Object.create(controller.prototype);

  componentHooks._beforeCtrlInvoke.forEach(hook => hook(caller, injects, controller, ddo, $injector, locals));

  // Finally, invoke the constructor using the injection array and the captured
  // locals
  $injector.invoke([...injects, controller], instance, locals);

  componentHooks._afterCtrlInvoke.forEach(hook => hook(caller, injects, controller, ddo, $injector, locals));

  // Use a1atscript's inputsBuilder to add the getters/setters then sugar
  // over `=` and `@` bindings
  for(let key in ddo.inputMap) {
    inputsBuilder(instance, key, ddo.inputMap[key]);
  }
  // Remember, angular has already set those bindings on the `caller`
  // argument. Now we need to extend them onto our `instance`. It is important
  // to extend after defining the properties. That way we fire the setters.
  Object.assign(instance, caller);

  // Outputs work similarly, but they need the raw $element and the $scope for
  // destroying output observables.
  let {$element, $scope} : { $element: JQuery, $scope: ng.IScope } = locals;
  outputsBuilder(instance, $element, $scope, ddo.outputMap || {});

  if (typeof instance.ngOnInit === 'function') {
    instance.ngOnInit();
  }

  // Return the controller instance
  return instance;
}
