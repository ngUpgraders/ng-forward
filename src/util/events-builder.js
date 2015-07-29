/* global Event */
import {Subject} from 'rx';


export default function(element, $scope, events){
  let emitters = {};
  let subscriptions = [];

  const create = (emitter, eventKey) => {
    return emitter.subscribe(
      data => {
        let event = new Event(eventKey, { detail: data });
        element.dispatchEvent(event);
      }
    );
  };

  for(let key in events){
    const name = `${key[0].toUpperCase()}${key.slice(1)}Emitter`;
    emitters[name] = new Subject();

    subscriptions.push(create(emitters[name], events[key]));
  }

  $scope.$on('$destroy', () => {
    subscriptions.forEach(subscription => subscription.dispose());
  });

  return emitters;
}
