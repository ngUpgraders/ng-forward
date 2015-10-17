import _ from './util/jqlite-extensions';

import Module from './module';
import bootstrap from './bootstrap';

import { Inject } from './decorators/inject';
import { Providers } from './decorators/Providers';
import { EventEmitter } from './util/event-emitter';
import { provide, Provider } from './classes/provider';
import { OpaqueToken } from './classes/opaque-token';

import { Animation } from './decorators/providers/animation';
import { Component } from './decorators/providers/component';
import { Directive } from './decorators/providers/directive';
import { Factory } from './decorators/providers/factory';
import { Pipe } from './decorators/providers/pipe';
import { Injectable } from './decorators/providers/injectable';
import { StateComponent } from './decorators/providers/state-component';

import { Require } from './decorators/component/require';
import { View } from './decorators/component/view';
import { Transclude } from './decorators/component/transclude';

export {
	Module,
	bootstrap,
	Providers,
	provide,
	OpaqueToken,
	EventEmitter,

	Inject,
	Provider,
	Component,
	Directive,
	Pipe,
	Factory,
	Injectable,
	Animation,
	StateComponent,

	Require,
	View,
	Transclude
};
