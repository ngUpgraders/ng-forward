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
@Inject(SomeService, SomeOtherService, '$http', '$timeout')
class SomeComponent {
  constructor(SomeService, SomeOtherService, $http, $timeout) {
    Object.assign(this, {SomeService, SomeOtherService, $http, $timeout});
    this.local = 'a';
    $http.get('/api');
    $timeout(() => this.local = 'c', 1000);
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

  let tcb;
  let angular;

  beforeEach(() => {
    tcb = new TestComponentBuilder();
    angular = ng.useReal();
  });

  describe('Test Component Builder', () => {
    let mockSomeService;
    let mockSomeOtherService;
    let $http;
    let $timeout;
    let rootTC;
    let rootTestEl;
    let someComponentEl;

    beforeEach(bindings(bind => {
      mockSomeService = {
        getData: sinon.stub().returns('mock success')
      };

      $http = { get: sinon.stub() };

      return [
        bind(SomeService).toValue(mockSomeService),
        bind('$http').toValue($http)
      ];
    }));

    // testing adding more bindings in an additional beforeEach
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
      someComponentEl = angular.element(rootTC.debugElement.componentViewChildren[0]);
    });

    // todo: write a custom inject function for ng-forward
    // currently I'm just using angular.mock.inject
    beforeEach(inject(_$timeout_ => {
      $timeout = _$timeout_
    }));

    it('should bootstrap the test module', () => {
      expect(angular.module('test-ng-forward')).to.exist;
    });

    it('should return a root test component and decorated jqlite', () => {
      expect(rootTC).to.be.an.instanceOf(RootTestComponent);

      // debugElement is an angular.element decorated with extra properties, see next lines
      expect(rootTC.debugElement)
          .to.be.an.instanceOf(angular.element);

      // nativeElement is an alias to the [0] index raw dom element
      expect(rootTC.debugElement.nativeElement)
          .to.be.an.instanceOf(HTMLElement);

      // The actual class instance hosted by the element
      expect(rootTC.debugElement.componentInstance)
          .to.be.an.instanceOf(TestComponent);

      // componentViewChildren is an alias to .children()
      expect(rootTC.debugElement.componentViewChildren)
          .to.be.an.instanceOf(angular.element);

      // Checking to be sure even nested jqlite elements are decorated
      expect(someComponentEl.nativeElement)
          .to.be.an.instanceOf(HTMLElement);

      expect(someComponentEl.componentInstance)
          .to.be.an.instanceOf(SomeComponent);

      expect(someComponentEl.componentViewChildren).to.be.empty;
    });

    it('should allow mock decorated class components and services via bindings() method', () => {
      expect(mockSomeService.getData).to.have.been.called;
      expect(someComponentEl.text()).to.equal("Hello World mock success mock other a");
    });

    it('should allow mock angular 1 services via bindings() method', () => {
      expect($http.get).to.have.been.called;
    });

    it('should allow angular.mock special services (e.g. $timeout.flush)', () => {
      expect(someComponentEl.text()).to.equal("Hello World mock success mock other a");
      $timeout.flush();
      expect(someComponentEl.text()).to.equal("Hello World mock success mock other c");
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