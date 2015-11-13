import { sinon } from '../tests/frameworks';
import { ng } from '../tests/angular';
import { componentStore, bundleStore } from '../writers';
import Module from '../classes/module';
import { quickFixture } from '../tests/utils';
import { Component } from './component';
import { Injectable } from './injectable';
import { Inject } from './inject';
import { StateConfig } from './state-config';
//noinspection TypeScriptCheckImport
import uiRouter from 'angular-ui-router';

describe('@StateConfig Decorator', function(){
    let fixture, Parent, ChildA, ChildB, ChildBA, states;

    beforeEach(() => {
        ng.useStub();

        @Injectable()
        class Thing {}

        @Component({ selector: 'childa', template: 'childA contents' })
        @Inject('resolveA')
        class _ChildA {
            constructor(public resolveA, public thing) {}
        }

        @Component({ selector: 'childba', template: 'childBA contents' })
        @Inject('resolveB', 'resolveBA', Thing)
        class _ChildBA {
            constructor(public resolveB, public resolveBA) {}
        }

        @Component({ selector: 'childb', template: 'childB contents { <ng-outlet></ng-outlet> }' })
        @StateConfig([
            { name: 'childB.childBA', url: '/childBA', component: _ChildBA,
                resolve: {
                    resolveBA: () => 'BA resolved!'
                }
            }
        ])
        class _ChildB {}

        states = [
            { name: 'childA', url: '/childA', component: _ChildA,
                resolve: {
                    resolveA: () => 'A resolved!'
                }
            },
            { name: 'childB', url: '/childB', component: _ChildB,
                resolve: {
                    resolveB: () => 'B resolved!'
                }
            }
        ];

        @Component({
            selector: 'parent',
            providers: [uiRouter],
            template: `<ng-outlet></ng-outlet><ng-outlet name="aux"></ng-outlet>`
        })
        @StateConfig(states)
        class _Parent {}

        Parent = _Parent;
        ChildA = _ChildA;
        ChildB = _ChildB;
        ChildBA = _ChildBA;
    });

    it('adds state metadata to the class', () => {
        componentStore.get('ui-router.stateChildConfigs', Parent).should.eql(states);
    });

    it('adds state metadata to each routed component', () => {
        componentStore.get('ui-router.stateConfigs', ChildA)[0].should.eql(states[0]);
        componentStore.get('ui-router.stateConfigs', ChildB)[0].should.eql(states[1]);
    });

    it('adds state components to class providers', () => {
        bundleStore.get('providers', Parent).should.eql([ChildA, ChildB]);
    });

    it('relies on ui-router', () => {
        fixture = quickFixture({ providers: [uiRouter] });
        fixture.debugElement.getLocal('$state').should.respondTo('go');
    });

    it('replaces instances of ng-outlet with ui-view', () => {
        fixture = quickFixture({ directives: [Parent], template: '<parent></parent>' });
        fixture.debugElement.getLocal('parentDirective')[0].template.should.eql('<ui-view></ui-view><ui-view name="aux"></ui-view>')
    });

    it('renders child component into outlet when state is activated', () => {
        fixture = quickFixture({ directives: [Parent], template: '<parent></parent>' });
        let $state = fixture.debugElement.getLocal('$state');

        $state.go('childA');
        fixture.detectChanges();

        fixture.debugElement.text().should.match(/childA contents/);
    });

    it('injects resolved deps into child component controller', () => {
        fixture = quickFixture({ directives: [Parent], template: '<parent></parent>' });
        let $state = fixture.debugElement.getLocal('$state');

        $state.go('childA');
        fixture.detectChanges();

        fixture.debugElement.find('childa').componentInstance.should.have.property('resolveA', 'A resolved!')
    });

    it('injects inherited resolved deps into child component controller', () => {
        fixture = quickFixture({ directives: [Parent], template: '<parent></parent>' });
        let $state = fixture.debugElement.getLocal('$state');

        $state.go('childB.childBA');
        fixture.detectChanges();

        let childBA = fixture.debugElement.find('childba').componentInstance;
        childBA.should.have.property('resolveB', 'B resolved!');
        childBA.should.have.property('resolveBA', 'BA resolved!');
    });
});