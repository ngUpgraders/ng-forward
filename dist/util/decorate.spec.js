'use strict';

var _tests = require('./tests');

var _decorate = require('./decorate');

describe('Decorator helpers for ES5/ES6', function () {
  it('should export the d helper object and two registeration functions', function () {
    _decorate.d.should.be.defined;
    _decorate.register.should.be.defined;
    _decorate.registerFactory.should.be.defined;
  });

  it('should let you register new simple decorators', function () {
    var spy = _tests.sinon.spy();
    (0, _decorate.register)('Test', spy);
    _decorate.d.Test['for'](function () {});

    _decorate.d.Test.should.be.defined;
    spy.should.have.been.called;
  });

  it('should let you register new decorator factories', function () {
    var spy = _tests.sinon.spy();
    (0, _decorate.registerFactory)('NewTest', function () {
      return spy;
    });
    _decorate.d.NewTest()['for'](function () {});

    _decorate.d.NewTest.should.be.defined;
    spy.should.have.been.called;
  });
});