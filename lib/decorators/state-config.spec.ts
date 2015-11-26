import { sinon } from '../tests/frameworks';
import { ng } from '../tests/angular';
import { componentStore, bundleStore } from '../writers';
import Module from '../classes/module';
import { quickFixture } from '../tests/utils';
import { Component } from './component';
import { Injectable } from './injectable';
import { Inject } from './inject';
import { StateConfig, Resolve } from './state-config';
//noinspection TypeScriptCheckImport
import uiRouter from 'angular-ui-router';

describe('@StateConfig Decorator', function(){
    let Parent, ChildA, ChildB, ChildBA, ChildZ, states;

    beforeEach(() => {
        ng.useStub();

        @Injectable()
        class Thing {
            public name = 'bob';
        }

        @Component({ selector: 'childa', template: 'childA contents' })
        @Inject('resolveA', 'resolveAA', 'renamedResolve', 'resolveAB', 'resolveAC', 'resolveOverwrite', Thing)
        class _ChildA {

            constructor(public resolveA, public resolveAA, public renamedResolve, public resolveAB,
                        public resolveAC, public resolveOverwrite, public thing) {}

            @Resolve()
            static resolveAA(): string {
                return 'AA resolved!';
            }

            @Resolve('renamedResolve')
            static asdf(): string {
                return 'renamed resolved!';
            }

            @Resolve()
            static resolveOverwrite(): string {
                return 'Yup!';
            }

            @Resolve()
            @Inject('resolveAA')
            static resolveAB(resolveAA): string {
                return resolveAA.substr(0, 3) + 'AB resolved!';
            }

            @Resolve()
            @Inject(Thing)
            static resolveAC(thing): string {
                return thing.name;
            }
        }

        @Component({ selector: 'child-z', template: 'childZ contents' })
        class _ChildZ {
            constructor() {}
        }

        @Component({ selector: 'childba', template: 'childBA contents' })
        @Inject('resolveB', 'resolveBA', Thing)
        class _ChildBA {
            constructor(public resolveB, public resolveBA, public thing) {}
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

        @Component({
            selector: 'parent',
            providers: [uiRouter],
            template: `<ng-outlet></ng-outlet><ng-outlet name="aux"></ng-outlet>`
        })
        @StateConfig(states = [
            { name: 'childA', url: '/childA', component: _ChildA,
                resolve: {
                    resolveA: () => 'A resolved!',
                    resolveOverwrite: () => 'Nope!'
                }
            },
            { name: 'childB', url: '/childB', component: _ChildB,
                resolve: {
                    resolveB: () => 'B resolved!'
                }
            },
            { name: 'childZ', url: '/childZ', component: _ChildZ }
        ])
        class _Parent {}

        Parent = _Parent;
        ChildA = _ChildA;
        ChildB = _ChildB;
        ChildBA = _ChildBA;
        ChildZ = _ChildZ;
    });

    it('adds state metadata to the class', () => {
        componentStore.get('ui-router.stateChildConfigs', Parent).should.eql(states);
    });

    it('adds state metadata to each routed component', () => {
        componentStore.get('ui-router.stateConfigs', ChildA)[0].should.eql(states[0]);
        componentStore.get('ui-router.stateConfigs', ChildB)[0].should.eql(states[1]);
    });

    it('adds state components to class providers', () => {
        bundleStore.get('providers', Parent).should.eql([ChildA, ChildB, ChildZ]);
    });

    describe('Angular Integration', () => {
        let fixture, $state;

        beforeEach(() => {
            fixture = quickFixture({ directives: [Parent], template: '<parent></parent>' });
            $state = fixture.debugElement.getLocal('$state');
        });

        it('relies on ui-router', () => {
            $state.should.respondTo('go');
        });

        it('replaces instances of ng-outlet with ui-view', () => {
            fixture.debugElement.getLocal('parentDirective')[0].template.should.eql('<ui-view></ui-view><ui-view name="aux"></ui-view>')
        });

        it('renders child component into outlet when state is activated', () => {
            $state.go('childA');
            fixture.detectChanges();

            fixture.debugElement.text().should.match(/childA contents/);
        });

        it('renders dash-cased child component into outlet when state is activated', () => {
            $state.go('childZ');
            fixture.detectChanges();

            fixture.debugElement.text().should.match(/childZ contents/);
        });

        it('injects resolved deps into child component controller', () => {
            $state.go('childA');
            fixture.detectChanges();

            fixture.debugElement.find('childa').componentInstance.should.have.property('resolveA', 'A resolved!')
        });

        it('injects inherited resolved deps into child component controller', () => {
            $state.go('childB.childBA');
            fixture.detectChanges();

            let childBA = fixture.debugElement.find('childba').componentInstance;
            childBA.should.have.property('resolveB', 'B resolved!');
            childBA.should.have.property('resolveBA', 'BA resolved!');
        });

        it('resolves deps with @Resolve decorator', () => {
            $state.go('childA');
            fixture.detectChanges();

            let childA = fixture.debugElement.find('childa').componentInstance;
            childA.should.have.property('resolveAA', 'AA resolved!');
        });

        it('resolves deps with renamed @Resolve', () => {
            $state.go('childA');
            fixture.detectChanges();

            let childA = fixture.debugElement.find('childa').componentInstance;
            childA.should.have.property('renamedResolve', 'renamed resolved!');
        });

        it("overwrite resolves from 'resolve' on config with any @Resolve resolves", () => {
            $state.go('childA');
            fixture.detectChanges();

            let childA = fixture.debugElement.find('childa').componentInstance;
            childA.should.have.property('resolveOverwrite', 'Yup!');
        });

        it('injects @Resolve functions with non-string injectables', () => {
            $state.go('childA');
            fixture.detectChanges();

            let childA = fixture.debugElement.find('childa').componentInstance;
            childA.should.have.property('resolveAC', 'bob');
        });

        it('injects @Resolve functions with other resolved deps', () => {
            $state.go('childA');
            fixture.detectChanges();

            let childA = fixture.debugElement.find('childa').componentInstance;
            childA.should.have.property('resolveAB', 'AA AB resolved!');
        });
    });
});