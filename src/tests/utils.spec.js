/* global it, describe */
import './frameworks';
import {Component} from '../decorators/providers/component';
import {View} from '../decorators/component/view';
import {Inject} from '../decorators/inject';
import {ng} from './angular';
import {bindings, TestComponentBuilder} from './index';
import {RootTestComponent} from './test-component-builder';


class SomeService {
  getData() { return 'real success' }
}


class SomeOtherService {
  getData() { return 'real other' }
}


@Component({
  selector: 'some-component',
  properties: ['foo', 'baz:bar'],
  bindings: [SomeService]
})
@View({
  template: `{{someComponent.foo}} {{someComponent.baz}} {{someComponent.quux()}} {{someComponent.local}}`
})
@Inject(SomeService, SomeOtherService)
class SomeComponent {
  constructor(SomeService, SomeOtherService) {
    Object.assign(this, {SomeService, SomeOtherService});
    this.local = 'a';
  }
  quux() { return `${this.SomeService.getData()} ${this.SomeOtherService.getData()}` }
}


@Component({selector: 'test'})
@View({
  template: `<some-component foo="Hello" [bar]="test.bar"></some-component>`,
  directives: [SomeComponent]
})
class TestComponent {
  constructor() {
    this.bar = "World";
  }
}


describe('Test Utils', () => {

  let angular;
  let tcb;

  beforeEach(() => {
    angular = ng.useReal();
    tcb = new TestComponentBuilder();
  });

  describe('Test Component Builder', () => {
    let mockSomeService;
    let mockSomeOtherService;
    let rootTC;
    let rootTestEl;
    let someComponentEl;
    let ngElementKeys = ['find', 'scope', 'controller', 'injector', 'html', 'text', 'on', 'off', 'css'];

    beforeEach(bindings(bind => {
      mockSomeService = {
        getData: sinon.stub().returns('mock success')
      };

      return [
        bind(SomeService).toValue(mockSomeService)
      ];
    }));

    // testing add more bindings in additional beforeEach
    beforeEach(bindings(bind => {
      mockSomeOtherService = {
        getData: sinon.stub().returns('mock other')
      };

      return [
        bind(SomeOtherService).toValue(mockSomeOtherService)
      ];
    }));

    beforeEach(() => {
      rootTC = tcb.create(TestComponent);
      rootTestEl = rootTC.debugElement;
      someComponentEl = rootTC.debugElement.componentViewChildren[0];
    });

    it('should bootstrap the test module', () => {
      expect(angular.module('test-ng-forward')).to.exist;
    });

    it('should return a root test component', () => {
      expect(rootTC).to.be.an.instanceOf(RootTestComponent);

      // debugElement is an angular.element decorated with extra properties, see next lines
      expect(rootTC.debugElement.__proto__)
          .to.contain.all.keys(ngElementKeys);

      expect(rootTC.debugElement.nativeElement)
          .to.be.an.instanceOf(HTMLElement);

      expect(rootTC.debugElement.componentInstance)
          .to.be.an.instanceOf(TestComponent);

      // componentViewChildren is an array of children debugElements
      expect(rootTC.debugElement.componentViewChildren)
          .to.be.an('array');

      expect(rootTC.debugElement.componentViewChildren[0].__proto__)
          .to.contain.all.keys(ngElementKeys);

      expect(rootTC.debugElement.componentViewChildren[0].nativeElement)
          .to.be.an.instanceOf(HTMLElement);

      expect(rootTC.debugElement.componentViewChildren[0].componentInstance)
          .to.be.an.instanceOf(SomeComponent);
    });

    it('should allow mocked bindings via bindings() method', () => {
      expect(mockSomeService.getData).to.have.been.called;
      expect(someComponentEl.text()).to.equal("Hello World mock success mock other a");
    });

    it('should detect changes on root test component instance ', () => {
      expect(someComponentEl.text()).to.equal("Hello World mock success mock other a");

      rootTestEl.componentInstance.bar = "Angular 2";
      rootTC.detectChanges();

      expect(someComponentEl.text()).to.equal("Hello Angular 2 mock success mock other a");
    });

    it('should detect changes on component instance under test', () => {
      expect(someComponentEl.text()).to.equal("Hello World mock success mock other a");

      someComponentEl.componentInstance.local = "b";
      rootTC.detectChanges();

      expect(someComponentEl.text()).to.equal("Hello World mock success mock other b");
    });
  });
});