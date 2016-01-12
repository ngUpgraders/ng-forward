// # Outputs Builder
// Takes an instance of a controller and detects event emitters. Subscribes
// to the emitters to make event dispatching a breeze.
//
// ## Setup
// Import the EventEmitter class
import EventEmitter from '../events/event-emitter';
import {INgForwardJQuery} from "../util/jqlite-extensions";
import CustomEvent from '../util/custom-event';

// ## Function
// Takes an instance of the controller, element of the component for dispatching
// the output, $scope for disposing of subscriptions, and a map of the emitters and
// outputs that might be on the instance
export default function(instance: any, element: INgForwardJQuery, $scope: ng.IScope, outputs: any){
  // Collection of subscriptions we'll generate
  let subscriptions: any[] = [];

  // Create a subscription to the event emitter. When we observe a new value,
  // dispatch a bubbling event onto the element
  const create = (eventKey: string, emitter: EventEmitter) => {
    return emitter.subscribe((data: any) => {
      let event = new CustomEvent(eventKey, { detail: {_output: data}, bubbles: false });
      element[0].dispatchEvent(event);
    });
  };

  // Iterate over the emmitterKeys to detect if the controller created any
  // EventEmitters. If it did, subscribe to the emitter to dispatch the outputs.
  for(let key in outputs){
    if(instance[key] && instance[key] instanceof EventEmitter){
      subscriptions.push(create(outputs[key], instance[key]));
    }
  }

  // Once the component's scope has been destroyed, tear down the subscriptions.
  $scope.$on('$destroy', (event: ng.IAngularEvent) => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });
}
