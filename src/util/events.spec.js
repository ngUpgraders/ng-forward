/* global describe, it */
import { sinon } from '../tests/frameworks';
import events from '../util/events';
import { quickRootTestComponent } from '../tests/internal-utils';

describe('Auto-generated Event Directives', function(){

  describe('Angular Integration', () => {

    beforeEach(() => {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      this.clock.restore();
    });

    it('creates a directive per item in the set', () => {
      let root = quickRootTestComponent({});

      let allEvents = [
        'click','dblclick','mousedown','mouseup','mouseover','mouseout','mousemove',
        'mouseenter','mouseleave','keydown','keyup','keypress','submit','focus',
        'blur','copy','cut','paste','change','dragstart','drag','dragenter',
        'dragleave','dragover','drop','dragend','error','input','load','wheel','scroll'
      ];

      let asserts = 0;

      allEvents.forEach(name => {
        asserts++;
        root.debugElement.getLocal(`(${name})Directive`)[0].name.should.eql(`(${name})`);
      });

      asserts.should.eql(allEvents.length);
    });

    it('bubbles the events', () => {
      let root = quickRootTestComponent({
        template: `
        <div ng-init="test.clicked=false" (click)="test.clicked=true">
          <button>Click Me</button>
        </div>
        `
      });

      root.debugElement.componentInstance.clicked.should.be.false;
      root.debugElement.find('button').nativeElement.click();
      root.debugElement.componentInstance.clicked.should.be.true;
    });
  });
});
