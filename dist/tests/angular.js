'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _testsFrameworks = require('../tests/frameworks');

var ngMocks = {
	factory: _testsFrameworks.sinon.spy(),
	config: _testsFrameworks.sinon.spy(),
	run: _testsFrameworks.sinon.spy(),
	service: _testsFrameworks.sinon.spy(),
	animation: _testsFrameworks.sinon.spy(),
	directive: _testsFrameworks.sinon.spy(),
	provider: _testsFrameworks.sinon.spy(),
	filter: _testsFrameworks.sinon.spy()
};

exports.ngMocks = ngMocks;
var angular = {
	module: _testsFrameworks.sinon.stub().returns(ngMocks)
};

exports.angular = angular;
global.angular = angular;