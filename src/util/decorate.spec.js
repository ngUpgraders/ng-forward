import {sinon} from '../tests/frameworks';
import {d, register, registerFactory} from './decorate';

describe('Decorator helpers for ES5/ES6', function(){
  it('should export the d helper object and two registeration functions', function(){
    d.should.be.defined;
    register.should.be.defined;
    registerFactory.should.be.defined;
  });

  it('should let you register new simple decorators', function(){
    let spy = sinon.spy();
    register('Test', spy);
    d.Test.for(function(){ });

    d.Test.should.be.defined;
    spy.should.have.been.called;
  });

  it('should let you register new decorator factories', function(){
    let spy = sinon.spy();
    registerFactory('NewTest', () => spy);
    d.NewTest().for(function(){ });

    d.NewTest.should.be.defined;
    spy.should.have.been.called;
  });
});
