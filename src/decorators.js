import { Inject } from './decorators/inject';

import { Component } from './decorators/providers/component';
import { Controller } from './decorators/providers/controller';
import { Directive } from './decorators/providers/directive';
import { Factory } from './decorators/providers/factory';
import { Provider } from './decorators/providers/provider';
import { Service } from './decorators/providers/service';
import { Filter } from './decorators/providers/filter';

import { Require } from './decorators/component/require';
import { View } from './decorators/component/view';
import { Transclude } from './decorators/component/transclude';

export {
	Component,
	Controller,
	Directive,
	Factory,
	Inject,
	Provider,
	Require,
	Service,
	View,
	Transclude,
	Filter
};