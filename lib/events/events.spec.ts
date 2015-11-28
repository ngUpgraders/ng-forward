import { sinon } from '../tests/frameworks';
import events from '../events/events';
import { quickFixture } from '../tests/utils';

describe('Auto-generated Event Directives', function(){

  describe('Angular Integration', () => {

    beforeEach(() => {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      this.clock.restore();
    });

    it('creates a directive per item in the set', () => {
      let fixture = quickFixture({});

      let allEvents = [
        'click','dblclick','mousedown','mouseup','mouseover','mouseout','mousemove',
        'mouseenter','mouseleave','keydown','keyup','keypress','submit','focus',
        'blur','copy','cut','paste','change','dragstart','drag','dragenter',
        'dragleave','dragover','drop','dragend','error','input','load','wheel','scroll'
      ];

      let asserts = 0;

      allEvents.forEach(name => {
        asserts++;
        fixture.debugElement.getLocal(`(${name})Directive`)[0].name.should.eql(`(${name})`);
      });

      asserts.should.eql(allEvents.length);
    });

    xit('bubbles the events', () => {
      let fixture = quickFixture({
        template: `
        <div ng-init="ctrl.clicked=false" (click)="ctrl.clicked=true">
          <button>Click Me</button>
        </div>
        `
      });

      fixture.debugElement.componentInstance.clicked.should.be.false;
      fixture.debugElement.find('button').nativeElement.click();
      fixture.debugElement.componentInstance.clicked.should.be.true;
    });
  });
});
