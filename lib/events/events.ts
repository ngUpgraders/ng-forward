import {Directive} from '../decorators/directive';
import {Inject} from '../decorators/inject';
import parseSelector from '../util/parse-selector';
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

function resolve(): any[]{
  let directives: any[] = [];

  events.forEach(event => {
    const selector = `[(${dasherize(event)})]`;
    @Directive({ selector })
    @Inject('$parse', '$element', '$attrs', '$scope')
    class EventHandler{
      public expression: any;

      constructor($parse: ng.IParseService, public $element: JQuery, $attrs: ng.IAttributes, public $scope: ng.IScope){
        let { name: attrName } = parseSelector(selector);
        this.expression = $parse($attrs[attrName]);
        $element.on(event, e => this.eventHandler(e));
        $scope.$on('$destroy', () => this.onDestroy());
      }

      eventHandler($event: any = {}){
        if ($event.detail && $event.detail._output !== undefined) {
          $event = $event.detail._output;
        }

        if($event.originalEvent && $event.originalEvent.detail && $event.originalEvent.detail._output) {
          $event = $event.detail._output;
        }

        this.expression(this.$scope, {$event});
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

function add(...customEvents: string[]){
  customEvents.forEach(event => events.add(event));
}

export default { resolve, add };
