import Decorator from './classes/decorator';
// Classes
import Module from './classes/module';
import Metastore from './classes/metastore';
import { OpaqueToken } from './classes/opaque-token';
import { Provider, provide } from './classes/provider';

// Decorators
import { Component } from './decorators/component';
import { Directive } from './decorators/directive';
import { Inject } from './decorators/inject';
import { Injectable } from './decorators/injectable';
import { Pipe } from './decorators/pipe';
import { Providers } from './decorators/providers';

// Events
import events from './events/events';
import EventEmitter from './events/event-emitter';

// Functions
import bootstrap from './bootstrap';
import bundle from './bundle';

// Writers
import { bundleStore, providerStore, componentStore } from './writers';


Decorator.addDecorator('Component', Component);
Decorator.addDecorator('Directive', Directive);
Decorator.addDecorator('Inject', Inject);
Decorator.addDecorator('Injectable', Injectable);
Decorator.addDecorator('Pipe', Pipe);
Decorator.addDecorator('Providers', Providers);


const ngForward = Object.assign(new Decorator(), {
	// Classes
	Module,
	Metastore,
	OpaqueToken,
	Provider,
	provide,
	
	// Events
	events,
	EventEmitter,
	
	// Functions
	bootstrap,
	bundle,
	
	// Writers
	bundleStore,
	providerStore,
	componentStore
});

export default ngForward;