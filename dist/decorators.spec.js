'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilTests = require('./util/tests');

var _utilTests2 = _interopRequireDefault(_utilTests);

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

xdescribe('Angular Decorators', function () {
	it('should export Component', function () {
		return Component.should.be.defined;
	});
	it('should export Controller', function () {
		return Controller.should.be.defined;
	});
	it('should export Directive', function () {
		return Directive.should.be.defined;
	});
	it('should export Factory', function () {
		return Factory.should.be.defined;
	});
	it('should export Inject', function () {
		return Inject.should.be.defined;
	});
	it('should export Provider', function () {
		return Provider.should.be.defined;
	});
	it('should export Require', function () {
		return Require.should.be.defined;
	});
	it('should export Service', function () {
		return Service.should.be.defined;
	});
	it('should export Template', function () {
		return Template.should.be.defined;
	});
	it('should export Transclude', function () {
		return Transclude.should.be.defined;
	});
	it('should export Module', function () {
		return Module.should.be.defined;
	});
});