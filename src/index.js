import Module from './module';
import bootstrap from './bootstrap';
import { Inject } from './decorators/inject';
import { Injectables } from './decorators/injectables';
import { EventEmitter } from './util/event-emitter';

import { Animation } from './decorators/providers/animation';
import { Component } from './decorators/providers/component';
import { Controller } from './decorators/providers/controller';
import { Directive } from './decorators/providers/directive';
import { Factory } from './decorators/providers/factory';
import { Pipe } from './decorators/providers/pipe';
import { Provider } from './decorators/providers/provider';
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
	Controller,
	Directive,
	Pipe,
	Provider,
	Factory,
	Service,
	Animation,
	StateComponent,

	Require,
	View,
	Transclude
};
