import chai from './util/tests';
// import {
// 	Component,
// 	Controller,
// 	Directive,
// 	Factory,
// 	Inject,
// 	Provider,
// 	Require,
// 	Service,
// 	Template,
// 	Transclude,
// 	Module
// } from './decorators';

xdescribe('Angular Decorators', function(){
	it('should export Component', () => Component.should.be.defined );
	it('should export Controller', () => Controller.should.be.defined );
	it('should export Directive', () => Directive.should.be.defined );
	it('should export Factory', () => Factory.should.be.defined );
	it('should export Inject', () => Inject.should.be.defined );
	it('should export Provider', () => Provider.should.be.defined);
	it('should export Require', () => Require.should.be.defined );
	it('should export Service', () => Service.should.be.defined );
	it('should export Template', () => Template.should.be.defined );
	it('should export Transclude', () => Transclude.should.be.defined );
	it('should export Module', () => Module.should.be.defined );
});