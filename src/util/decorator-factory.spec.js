/*global describe,it */
import '../tests/frameworks';
import {providerWriter} from '../writers';
import decoratorFactory from './decorator-factory';

describe('Decorator Factory', function(){
  it('should generate a decorator for the provided type', function(){
    const test = decoratorFactory('test');

    @test('name')
    class Example{ }

    providerWriter.get('type', Example).should.eql('test');
    providerWriter.get('name', Example).should.eql('name');
  });

  it('should throw an error if you pass an explicit name twice', function(){
    const test = decoratorFactory('test');
    const decorate = () => {
      @test('example')
      class Example{ }
    };

    decorate();
    decorate.should.throw(Error, /type test and name example has already been registered/);
  });

  it('should use the name of the class if a string name is not provided', function(){
    const test = decoratorFactory('test');

    @test
    class Example{ }

    providerWriter.get('name', Example).should.eql('Example');
  });

  it('should generate a random name if you attempt to decorate a function with the same name', function(){
    const test = decoratorFactory('test');

    test(function Example(){ });

    @test
    class Example{ }

    providerWriter.get('name', Example).should.not.eql('Example');
  });
});
