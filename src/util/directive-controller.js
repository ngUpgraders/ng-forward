/* global Object */
import {propertiesBuilder} from './properties-builder';
import eventsBuilder from './events-builder';
import extend from 'extend';

export default function directiveControllerFactory(injects, controller, ddo){
  return [
    '$element', '$scope', '$attrs', '$transclude', '$injector',
    function($element, $scope, $attrs, $transclude, $injector){
        let instance = Object.create(controller.prototype);
        for(let key in ddo.properties){
          propertiesBuilder(instance, key, ddo.properties[key]);
        }
        extend(instance, this);

        let events = eventsBuilder($element[0], $scope, ddo.events || {});

        extend(instance, events);

        $injector.invoke([...injects, controller], instance, {
          $element,
          $scope,
          $attrs,
          $transclude
        });

        return instance;
    }
  ];
}
