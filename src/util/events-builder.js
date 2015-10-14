/* global Event */
// # Events Builder
// Takes an instance of a controller and detects event emitters. Subscribes
// to the emitters to make event dispatching a breeze.
//
// ## Setup
// Import the EventEmitter class
import {EventEmitter} from './event-emitter';

// ## Function
// Takes an instance of the controller, element of the component for dispatching
// the event, $scope for disposing of subscriptions, and a map of the emitters and
// events that might be on the instance
export default function(instance, element, $scope, events){
  // Collection of subscriptions we'll generate
  let subscriptions = [];

  // Create a subscription to the event emitter. When we observe a new value,
  // dispatch a bubbling event onto the element
  const create = (eventKey, emitter) => {
    return emitter.observer({
      next: data => {
        let event = new CustomEvent(eventKey, { detail: data, bubbles: true });
        element.dispatchEvent(event);
      }
    });
  };

  // Iterate over the emmitterKeys to detect if the controller created any
  // EventEmitters. If it did, subscribe to the emitter to dispatch the events.
  for(let key in events){
    if(instance[key] && instance[key] instanceof EventEmitter){
      subscriptions.push(create(events[key], instance[key]));
    }
  }

  // Once the component's scope has been destroyed, tear down the subscriptions.
  $scope.$on('$destroy', () => {
    subscriptions.forEach(subscription => subscription.dispose());
  });
}
