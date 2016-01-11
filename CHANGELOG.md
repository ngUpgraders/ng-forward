<a name="0.0.1-alpha.12"></a>
## [0.0.1-alpha.12](https://github.com/ngUpgraders/ng-forward/compare/0.0.1-alpha.11...v0.0.1-alpha.12) (2016-01-11)


### Bug Fixes

* **Component:** Inputs should NOT be initialized in the constructor ([f8e5b3c](https://github.com/ngUpgraders/ng-forward/commit/f8e5b3c))
* **Provider:** provide(SomeClass, {useClass: SomeOtherClass}) not properly overriding SomeClass ([f5f0b77](https://github.com/ngUpgraders/ng-forward/commit/f5f0b77)), closes [#129](https://github.com/ngUpgraders/ng-forward/issues/129)
* **ts:** Make param optional ([b72edd3](https://github.com/ngUpgraders/ng-forward/commit/b72edd3)), closes [#114](https://github.com/ngUpgraders/ng-forward/issues/114)

### Features

* **Component:** ngAfterViewInit life cycle hook ([ab536e3](https://github.com/ngUpgraders/ng-forward/commit/ab536e3)), closes [#119](https://github.com/ngUpgraders/ng-forward/issues/119)
* **Component:** ngOnDestroy life cycle hook ([f5182d5](https://github.com/ngUpgraders/ng-forward/commit/f5182d5))
* **Component:** ngOnInit life cycle hook ([4d52063](https://github.com/ngUpgraders/ng-forward/commit/4d52063))
* **DebugElement:** query and queryAll methods for more easily finding child elements by all(), css( ([fbb94c4](https://github.com/ngUpgraders/ng-forward/commit/fbb94c4))


### BREAKING CHANGES

* Component: Before:

```js
@Component()
class Child {
  @Input() foo;

  constructor() {
    console.log(this.foo); // bar
  }
}

@Component({ template: '<child foo="bar"></child>' })
class Parent {}
```

After:

Before:

```js
@Component()
class Child {
  @Input() foo;

  constructor() {
    console.log(this.foo); // undefined
  }
}

@Component({ template: '<child foo="bar"></child>' })
class Parent {}
```



<a name="0.0.1-alpha.11"></a>
## [0.0.1-alpha.11](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.10...0.0.1-alpha.11) (2015-12-09)


### Bug Fixes

* **API:** added module name to example ([be27c11](https://github.com/ngUpgraders/ng-forward/commit/be27c11))
* **API:** added points about using @Inject on static methods ([259fa10](https://github.com/ngUpgraders/ng-forward/commit/259fa10))
* **API:** make params bold ([9cbd0d0](https://github.com/ngUpgraders/ng-forward/commit/9cbd0d0))
* **API:** make params bold 2 ([a0311fa](https://github.com/ngUpgraders/ng-forward/commit/a0311fa))
* **API:** move up section ([4be0e33](https://github.com/ngUpgraders/ng-forward/commit/4be0e33))
* **API:** tweaks, links, typos ([782fd75](https://github.com/ngUpgraders/ng-forward/commit/782fd75))

### Features

* **controllerAs:** Set default controllerAs value to 'ctrl'. ([8c2b1f2](https://github.com/ngUpgraders/ng-forward/commit/8c2b1f2))
* **Inject:** find and inject parent controllers as locals ([a4d0f68](https://github.com/ngUpgraders/ng-forward/commit/a4d0f68)), closes [#98](https://github.com/ngUpgraders/ng-forward/issues/98)


### BREAKING CHANGES

* controllerAs: Before:
```js
@Component({ selector: 'app', template: '{{app.foo}}' })
```

After:
```js
@Component({ selector: 'app', template: '{{ctrl.foo}}' })

// or

@Component({ selector: 'app', controllerAs: '$auto', template: '{{app.foo}}' })
```



<a name="0.0.1-alpha.10"></a>
## [0.0.1-alpha.10](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.9...v0.0.1-alpha.10) (2015-11-28)


### Bug Fixes

* **API:** fix toc links to be bullets ([ca0eb20](https://github.com/ngUpgraders/ng-forward/commit/ca0eb20))
* **API:** move EventEmitter link to proper group ([b683af6](https://github.com/ngUpgraders/ng-forward/commit/b683af6))
* **npm:** Publishing the dist folder ([8cc27e9](https://github.com/ngUpgraders/ng-forward/commit/8cc27e9))



<a name="0.0.1-alpha.9"></a>
## [0.0.1-alpha.9](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.8...v0.0.1-alpha.9) (2015-11-26)


### Bug Fixes

* **build:** Removed sinon-chai from karma frameworks ([c899281](https://github.com/ngUpgraders/ng-forward/commit/c899281))
* **error:** Make error message around invalid providers more helpful. ([bb55d69](https://github.com/ngUpgraders/ng-forward/commit/bb55d69)), closes [#38](https://github.com/ngUpgraders/ng-forward/issues/38)
* **Input/Output:** add Input and Output to index exports ([9a26089](https://github.com/ngUpgraders/ng-forward/commit/9a26089))
* **README:** fix typo ([e1fed23](https://github.com/ngUpgraders/ng-forward/commit/e1fed23)), closes [#76](https://github.com/ngUpgraders/ng-forward/issues/76)
* **README:** sync final example with other changes ([74ae89b](https://github.com/ngUpgraders/ng-forward/commit/74ae89b)), closes [#90](https://github.com/ngUpgraders/ng-forward/issues/90)

### Features

* **Component:** Component hooks to allow extensions for components; move StateConfig into hooks; ([8b33ee6](https://github.com/ngUpgraders/ng-forward/commit/8b33ee6))
* **StateConfig:** Add @Resolve decorator for resolving state dependecies. ([45a096b](https://github.com/ngUpgraders/ng-forward/commit/45a096b))
* **StateConfig:** New StateConfig decorator for configuring ui-router states with components ([6daf87b](https://github.com/ngUpgraders/ng-forward/commit/6daf87b))
* **TestComponentBuilder:** add createAsync method to match Angular 2 api better. Returns Promise<ComponentF ([c95218c](https://github.com/ngUpgraders/ng-forward/commit/c95218c))



<a name="0.0.1-alpha.8"></a>
## [0.0.1-alpha.8](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2015-11-08)


### Bug Fixes

* **typings:** Created typings file for entry point of lib ([1847628](https://github.com/ngUpgraders/ng-forward/commit/1847628))

### Features

* **build:** export getInjectableName; used to get the ng1 provider name of any injectable; ([f83d202](https://github.com/ngUpgraders/ng-forward/commit/f83d202)), closes [#47](https://github.com/ngUpgraders/ng-forward/issues/47)
* **Input/Output:** Added property decorators for @Input and @Output ([349cd21](https://github.com/ngUpgraders/ng-forward/commit/349cd21)), closes [#48](https://github.com/ngUpgraders/ng-forward/issues/48)



<a name="0.0.1-alpha.7"></a>
## [0.0.1-alpha.7](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2015-11-04)


### Bug Fixes

* **decorators:** Changing decorators to emit a call signature for TS ([d6b8270](https://github.com/ngUpgraders/ng-forward/commit/d6b8270))



<a name="0.0.1-alpha.6"></a>
## [0.0.1-alpha.6](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-ts-alpha.2...v0.0.1-alpha.6) (2015-11-03)


### Bug Fixes

* **outputs:** Calling unsubscribe method instead of dispose ([72812d4](https://github.com/ngUpgraders/ng-forward/commit/72812d4))



<a name="0.0.1-ts-alpha.2"></a>
## [0.0.1-ts-alpha.2](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-ts-alpha.1...v0.0.1-ts-alpha.2) (2015-11-03)


### Bug Fixes

* **inputs-builder:** Allow string and oneway to set their local copy of input prop to different than  ([d5882f1](https://github.com/ngUpgraders/ng-forward/commit/d5882f1)), closes [#14](https://github.com/ngUpgraders/ng-forward/issues/14)
* **README:** fix errors ([0630bfd](https://github.com/ngUpgraders/ng-forward/commit/0630bfd))
* **README:** fix link ([5a2f6f0](https://github.com/ngUpgraders/ng-forward/commit/5a2f6f0))



<a name="0.0.1-alpha.4"></a>
## [0.0.1-alpha.4](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.3...v0.0.1-alpha.4) (2015-10-24)


### Bug Fixes

* **travis:** Updating npm to npm@3 for travis builds ([524be2b](https://github.com/ngUpgraders/ng-forward/commit/524be2b))



<a name="0.0.1-alpha.3"></a>
## [0.0.1-alpha.3](https://github.com/ngUpgraders/ng-forward/compare/v0.0.1-alpha.2...v0.0.1-alpha.3) (2015-10-21)


### Bug Fixes

* **Logo:** smaller size ([2de18c3](https://github.com/ngUpgraders/ng-forward/commit/2de18c3))



<a name="0.0.1-alpha.2"></a>
## [0.0.1-alpha.2](https://github.com/ngUpgraders/ng-forward/compare/4d3b5e2...v0.0.1-alpha.2) (2015-10-19)


### Bug Fixes

* **events-builder:** allow data to be passed in events ([d8a1b54](https://github.com/ngUpgraders/ng-forward/commit/d8a1b54))
* **Inject:** better invalid provider error ([7b77830](https://github.com/ngUpgraders/ng-forward/commit/7b77830))
* **properties-builder:** cope with 2-way binding initialized to falsy defined values ([467534f](https://github.com/ngUpgraders/ng-forward/commit/467534f))
* **properties-builder:** cope with missing property attributes ([2b06bd9](https://github.com/ngUpgraders/ng-forward/commit/2b06bd9))
* **Provider:** fix support for nested provider dependencies when using useFactory with deps ([9044521](https://github.com/ngUpgraders/ng-forward/commit/9044521))

### Features

* **OpaqueToken:** added OpaqueToken for creating const string tokens ([0563cb5](https://github.com/ngUpgraders/ng-forward/commit/0563cb5))
* **Providers:** rename bindings to providers; add support for Providers; ([86bb7b0](https://github.com/ngUpgraders/ng-forward/commit/86bb7b0)), closes [#18](https://github.com/ngUpgraders/ng-forward/issues/18) [#9](https://github.com/ngUpgraders/ng-forward/issues/9)
* **README:** update README with information about jspm installation ([4d3b5e2](https://github.com/ngUpgraders/ng-forward/commit/4d3b5e2))
* **testing:** Add ability to access $injector via .getLocal alias on debugElement ([ef489a5](https://github.com/ngUpgraders/ng-forward/commit/ef489a5))
* **testing:** add ability to override providers array in tests with tcb.overrideProviders ([5ce7124](https://github.com/ngUpgraders/ng-forward/commit/5ce7124))


### BREAKING CHANGES

* Provider: Non-annotated classes can no longer be injected. You must use the new @Injectable decorator.
Before:
   class Foo {}
After:
   @Injectable()
   class Foo {}
* Providers: bindings have been renamed to providers
Before:
    @Component({ bindings: [] })
After:
    @Component({ providers: [] })



