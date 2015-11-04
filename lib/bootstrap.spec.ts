import './tests/frameworks';
import {ng} from './tests/angular';
import bootstrap from './bootstrap';


import {Component} from './decorators/component';
import {Inject} from './decorators/inject';
import {DecoratedModule} from './classes/module';
import {Provider} from './classes/provider';

describe('Bootstrap Integration', () => {
    let angular, myAppEl, injector;

    before(() => {
        angular = ng.useReal();

        myAppEl = document.createElement("my-app");
        document.body.appendChild(myAppEl);

        @Component({ selector: 'my-app', template: 'x' })
        class MyApp {}

        injector = bootstrap(MyApp);
    });

    it('bundles up an angular module', () => {
        angular.module('my-app').should.exist;
    });

    it('bootstraps the angular module', () => {
        angular.element(myAppEl).text().should.eql('x');
    });

    it('returns the injector', () => {
        injector.should.respondTo('get');
        injector.get('myAppDirective')[0].should.have.property('name', 'myApp');
    });
});