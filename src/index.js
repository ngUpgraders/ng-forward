import _ from './util/jqlite-extensions';
import Module from './module';
import bootstrap from './bootstrap';
import { Inject } from './decorators/inject';
import { Injectables } from './decorators/injectables';
import { EventEmitter } from './util/event-emitter';

import { Animation } from './decorators/providers/animation';
import { Component } from './decorators/providers/component';
import { Directive } from './decorators/providers/directive';
import { Factory } from './decorators/providers/factory';
import { Pipe } from './decorators/providers/pipe';
import { Service } from './decorators/providers/service';
import { StateComponent } from './decorators/providers/state-component';

import { Require } from './decorators/component/require';
import { View } from './decorators/component/view';
import { Transclude } from './decorators/component/transclude';

export {
	Module,
	bootstrap,
	Inject,
	Injectables,
	EventEmitter,

	Component,
	Directive,
	Pipe,
	Factory,
	Service,
	Animation,
	StateComponent,

	Require,
	View,
	Transclude
};
