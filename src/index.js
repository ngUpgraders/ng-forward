import './util/jqlite-extensions';

export Module from './module';
export bootstrap from './bootstrap';
export bundle from './bundle';

export { Inject } from './decorators/inject';
export { Providers } from './decorators/Providers';
export { EventEmitter } from './util/event-emitter';
export { provide, Provider } from './classes/provider';
export { OpaqueToken } from './classes/opaque-token';

export { Animation } from './decorators/providers/animation';
export { Component } from './decorators/providers/component';
export { Directive } from './decorators/providers/directive';
export { Factory } from './decorators/providers/factory';
export { Pipe } from './decorators/providers/pipe';
export { Injectable } from './decorators/providers/injectable';
export { StateComponent } from './decorators/providers/state-component';

export { Require } from './decorators/component/require';
export { View } from './decorators/component/view';
export { Transclude } from './decorators/component/transclude';
