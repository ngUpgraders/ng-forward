'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

_chai2['default'].use(_sinonChai2['default']);

_chai2['default'].should();

var expect = _chai2['default'].expect;

exports['default'] = _chai2['default'];
exports.expect = expect;
exports.sinon = _sinon2['default'];