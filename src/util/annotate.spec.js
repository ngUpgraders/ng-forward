import {sinon} from '../tests/frameworks';
import {a, register, registerFactory} from './decorate';

describe('Decorator helpers for ES5/ES6', function(){
  it('should export the d helper object and two registeration functions', function(){
    a.should.be.defined;
    register.should.be.defined;
    registerFactory.should.be.defined;
  });

  it('should let you register new simple decorators', function(){
    let spy = sinon.spy();
    register('Test', spy);
    a.Test.for(function(){ });

    a.Test.should.be.defined;
    spy.should.have.been.called;
  });

  it('should let you register new decorator factories', function(){
    let spy = sinon.spy();
    registerFactory('NewTest', () => spy);
    a.NewTest().for(function(){ });

    a.NewTest.should.be.defined;
    spy.should.have.been.called;
  });
});
