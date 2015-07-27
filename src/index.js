import Module from './module';
import bootstrap from './bootstrap';
import { Inject } from './decorators/inject';
import { Injectables } from './decorators/injectables';

import { Animation } from './decorators/providers/animation';
import { Component } from './decorators/providers/component';
import { Controller } from './decorators/providers/controller';
import { Directive } from './decorators/providers/directive';
import { Factory } from './decorators/providers/factory';
import { Filter } from './decorators/providers/filter';
import { Provider } from './decorators/providers/provider';
import { Service } from './decorators/providers/service';

import { Require } from './decorators/component/require';
import { View } from './decorators/component/view';
import { Transclude } from './decorators/component/transclude';

export {
	Module,
	bootstrap,
	Inject,
	Injectables,

	Component,
	Controller,
	Directive,
	Filter,
	Provider,
	Factory,
	Service,
	Animation,

	Require,
	View,
	Transclude
};
