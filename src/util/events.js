import {Directive, Inject} from '../index';
import parseSelector from './parse-selector';
import {dasherize} from '../util/helpers';

let events = new Set([
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'keydown',
  'keyup',
  'keypress',
  'submit',
  'focus',
  'blur',
  'copy',
  'cut',
  'paste',
  'change',
  'dragstart',
  'drag',
  'dragenter',
  'dragleave',
  'dragover',
  'drop',
  'dragend',
  'error',
  'input',
  'load',
  'wheel',
  'scroll'
]);

function resolve(ngModule){
  let directives = [];

  events.forEach(event => {
    const selector = `[(${dasherize(event)})]`;
    @Directive({ selector })
    @Inject('$parse', '$element', '$attrs', '$scope')
    class EventHandler{
      constructor($parse, $element, $attrs, $scope){
        this.$scope = $scope;
        this.$element = $element;

        let { name: attrName } = parseSelector(selector);
        this.expression = $parse($attrs[attrName]);
        $element.on(event, e => this.eventHandler(e));
        $scope.$on('$destroy', () => this.onDestroy());
      }

      eventHandler($event){
        this.expression(this.$scope, { $event });
        this.$scope.$applyAsync();
      }

      onDestroy(){
        this.$element.off(event);
      }
    }

    directives.push(EventHandler);
  });

  return directives;
}

function add(...customEvents){
  customEvents.forEach(event => events.add(event));
}

export default { resolve, add };
