'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _chai = require('./util/tests');

var _chai2 = _interopRequireWildcard(_chai);

var _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module = require('./index');

describe('Angular Decorators', function () {
	it('should export Component', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Component.should.be.defined;
	});
	it('should export Controller', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Controller.should.be.defined;
	});
	it('should export Decorator', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Decorator.should.be.defined;
	});
	it('should export Factory', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Factory.should.be.defined;
	});
	it('should export Inject', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Inject.should.be.defined;
	});
	it('should export Require', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Require.should.be.defined;
	});
	it('should export Service', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Service.should.be.defined;
	});
	it('should export Template', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Template.should.be.defined;
	});
	it('should export Transclude', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Transclude.should.be.defined;
	});
	it('should export Module', function () {
		return _Component$Controller$Decorator$Factory$Inject$Require$Service$Template$Transclude$Module.Module.should.be.defined;
	});
});