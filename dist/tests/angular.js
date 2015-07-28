'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _frameworks = require('./frameworks');

var _node_modulesAngular = require('../../node_modules/angular');

var _node_modulesAngular2 = _interopRequireDefault(_node_modulesAngular);

var ngMocks = {
	factory: _frameworks.sinon.spy(),
	config: _frameworks.sinon.spy(),
	run: _frameworks.sinon.spy(),
	service: _frameworks.sinon.spy(),
	animation: _frameworks.sinon.spy(),
	directive: _frameworks.sinon.spy(),
	provider: _frameworks.sinon.spy(),
	filter: _frameworks.sinon.spy(),
	value: _frameworks.sinon.spy(),
	constant: _frameworks.sinon.spy()
};

exports.ngMocks = ngMocks;
var ng = {
	module: _frameworks.sinon.stub().returns(ngMocks),
	useStub: function useStub() {
		global.angular = this;
	},
	useReal: function useReal() {
		return global.angular = _node_modulesAngular2['default'];
	}
};

exports.ng = ng;
ng.useStub();