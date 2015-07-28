/*global describe,it */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('../tests/frameworks');

var _writers = require('../writers');

var _decoratorFactory = require('./decorator-factory');

var _decoratorFactory2 = _interopRequireDefault(_decoratorFactory);

describe('Decorator Factory', function () {
  it('should generate a decorator for the provided type', function () {
    var test = (0, _decoratorFactory2['default'])('test');

    var Example = (function () {
      function Example() {
        _classCallCheck(this, _Example);
      }

      var _Example = Example;
      Example = test('name')(Example) || Example;
      return Example;
    })();

    _writers.providerWriter.get('type', Example).should.eql('test');
    _writers.providerWriter.get('name', Example).should.eql('name');
  });

  it('should throw an error if you pass an explicit name twice', function () {
    var test = (0, _decoratorFactory2['default'])('test');
    var decorate = function decorate() {
      var Example = (function () {
        function Example() {
          _classCallCheck(this, _Example2);
        }

        var _Example2 = Example;
        Example = test('example')(Example) || Example;
        return Example;
      })();
    };

    decorate();
    decorate.should['throw'](Error, /type test and name example has already been registered/);
  });

  it('should use the name of the class if a string name is not provided', function () {
    var test = (0, _decoratorFactory2['default'])('test');

    var Example = (function () {
      function Example() {
        _classCallCheck(this, _Example3);
      }

      var _Example3 = Example;
      Example = test(Example) || Example;
      return Example;
    })();

    _writers.providerWriter.get('name', Example).should.eql('Example');
  });

  it('should generate a random name if you attempt to decorate a function with the same name', function () {
    var test = (0, _decoratorFactory2['default'])('test');

    test(function Example() {});

    var Example = (function () {
      function Example() {
        _classCallCheck(this, _Example4);
      }

      var _Example4 = Example;
      Example = test(Example) || Example;
      return Example;
    })();

    _writers.providerWriter.get('name', Example).should.not.eql('Example');
  });
});