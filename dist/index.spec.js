'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilTests = require('./util/tests');

var _utilTests2 = _interopRequireDefault(_utilTests);

var _index = require('./index');

describe('Angular Decorators', function () {
	it('should export Component', function () {
		return _index.Component.should.be.defined;
	});
	it('should export Controller', function () {
		return _index.Controller.should.be.defined;
	});
	it('should export Decorator', function () {
		return _index.Decorator.should.be.defined;
	});
	it('should export Factory', function () {
		return _index.Factory.should.be.defined;
	});
	it('should export Inject', function () {
		return _index.Inject.should.be.defined;
	});
	it('should export Provider', function () {
		return _index.Provider.should.be.defined;
	});
	it('should export Require', function () {
		return _index.Require.should.be.defined;
	});
	it('should export Service', function () {
		return _index.Service.should.be.defined;
	});
	it('should export Template', function () {
		return _index.Template.should.be.defined;
	});
	it('should export Transclude', function () {
		return _index.Transclude.should.be.defined;
	});
	it('should export Module', function () {
		return _index.Module.should.be.defined;
	});
});