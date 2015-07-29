/* global describe, it */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('../tests/frameworks');

var _filterBindings3 = require('./filter-bindings');

var _filterBindings4 = _interopRequireDefault(_filterBindings3);

var _writers = require('../writers');

var Test = function Test(t) {
  _writers.providerWriter.set('type', 'test', t);
  _writers.providerWriter.set('name', t.name, t);
};

describe('filterBindings Utility', function () {
  it('should separate providers and string-based module names', function () {
    var Example = (function () {
      function Example() {
        _classCallCheck(this, _Example);
      }

      var _Example = Example;
      Example = Test(Example) || Example;
      return Example;
    })();

    var _filterBindings = (0, _filterBindings4['default'])(['ui-router', 'ui-bootstrap', Example]);

    var modules = _filterBindings.modules;
    var providers = _filterBindings.providers;

    modules.should.eql(['ui-router', 'ui-bootstrap']);
    providers.should.eql([Example]);
  });

  it('should flatten the array if it is an array of arrays', function () {
    var Example = (function () {
      function Example() {
        _classCallCheck(this, _Example2);
      }

      var _Example2 = Example;
      Example = Test(Example) || Example;
      return Example;
    })();

    var Another = (function () {
      function Another() {
        _classCallCheck(this, _Another);
      }

      var _Another = Another;
      Another = Test(Another) || Another;
      return Another;
    })();

    var _filterBindings2 = (0, _filterBindings4['default'])([['ui-router'], 'ui-bootstrap', [Example, [Another]]]);

    var modules = _filterBindings2.modules;
    var providers = _filterBindings2.providers;

    modules.should.eql(['ui-router', 'ui-bootstrap']);
    providers.should.eql([Example, Another]);
  });
});