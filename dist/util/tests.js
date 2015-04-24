'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _chai = require('chai');

var _chai2 = _interopRequireWildcard(_chai);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireWildcard(_sinonChai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

_chai2['default'].use(_sinonChai2['default']);

_chai2['default'].should();

var expect = _chai2['default'].expect;

exports['default'] = _chai2['default'];
exports.expect = expect;
exports.sinon = _sinon2['default'];