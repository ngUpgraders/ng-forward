import {expect} from '../tests/frameworks';
import {ng} from '../tests/angular';
import bundle from '../bundle';
import bootstrap from '../bootstrap';
import {Component} from '../decorators/component';
import {Inject} from '../decorators/inject';
import inputsBuilder, {inputsMap} from './inputs-builder';

describe('inputs-builder', () => {

  describe('inputsMap', () => {
    it('should return map of three isolate scope properties per input', () => {
      let inputs = {
        foo: 'foo'
      };

      let definition = inputsMap(inputs);
      expect(definition).to.eql({
        '@foo': '@foo',
        '[foo]': '=?',
        '[(foo)]': '=?'
      });
    });

    it('should return map of inputs with local vs. public name', () => {
      let inputs = {
        fooLocal: 'fooPublic'
      };

      let definition = inputsMap(inputs);
      expect(definition).to.eql({
        '@fooLocal': '@fooPublic',
        '[fooPublic]': '=?',
        '[(fooPublic)]': '=?'
      });
    });

    it('should return empty map if there are no inputs', () => {
      let inputs = {};

      let definition = inputsMap(inputs);
      expect(definition).to.eql({});
    });
  });

  describe('inputsBuilder', () => {
    let controller;

    beforeEach(() => {
      controller = {};
    });

    describe('with localKey same as publicKey', () => {

      beforeEach(() => {
        inputsBuilder(controller, 'foo', 'foo');
      });

      it('should add several hidden properties to controller', () => {
        expect(controller).to.have.property('@foo');
        expect(controller).to.have.property('[foo]');
        expect(controller).to.have.property('[(foo)]');
      });

      it('should only be able to read from string input', () => {
        controller['@foo'] = 'bar';

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux';

        // changes local
        expect(controller.foo).to.equal('quux');

        // but has no effect on hidden string input property
        expect(controller['@foo']).to.equal('bar');

        // now if its externally changed both are set again
        controller['@foo'] = 'bazinga';
        expect(controller.foo).to.equal('bazinga');
      });

      it('should only be able to read from one-way input', () => {
        controller['[foo]'] = 'bar';

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux';

        // changes local
        expect(controller.foo).to.equal('quux');

        // but has no effect on hidden string input property
        expect(controller['[foo]']).to.equal('bar');

        // now if its externally changed both are set again
        controller['[foo]'] = 'bazinga';
        expect(controller.foo).to.equal('bazinga');
      });

      it('should be able to read and write a two-way input', () => {
        controller['[(foo)]'] = 'bar';

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux';

        // changes local
        expect(controller.foo).to.equal('quux');

        // and has effect on hidden string input property
        expect(controller['[(foo)]']).to.equal('quux');

        // and now if its externally changed both are set again
        controller['[(foo)]'] = 'bazinga';
        expect(controller.foo).to.equal('bazinga');
      });

      it('should allow writing to a two-way input that is initialized to a falsy defined value', function() {
        controller['[(foo)]'] = '';

        expect(controller.foo).to.equal('');
        controller.foo = 'quux';

        // changes local
        expect(controller.foo).to.equal('quux');

        // and has effect on hidden string input property
        expect(controller['[(foo)]']).to.equal('quux');
      });

      it('should not allow using more than one binding type', () => {
        controller['[foo]'] = 'bar';
        expect(() => {
          controller['[(foo)]'] = 'bar';
        }).to.throw(`Can not use more than one type of attribute binding simultaneously: foo, [foo], [(foo)]. Choose one.`);
      });
    });

    describe('with localKey different than publicKey', () => {
      beforeEach(() => {
        inputsBuilder(controller, 'fooLocal', 'fooPublic');
      });

      it('should add several hidden properties to controller', () => {
        expect(controller).to.have.property('@fooLocal');
        expect(controller).to.have.property('[fooPublic]');
        expect(controller).to.have.property('[(fooPublic)]');
      });

      it('should only be able to read from string input', () => {
        controller['@fooLocal'] = 'bar';

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux';

        // changes local
        expect(controller.fooLocal).to.equal('quux');

        // but has no effect on hidden string input property
        expect(controller['@fooLocal']).to.equal('bar');
      });

      it('should only be able to read from one-way input', () => {
        controller['[fooPublic]'] = 'bar';

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux';

        // changes local
        expect(controller.fooLocal).to.equal('quux');

        // but has no effect on hidden string input property
        expect(controller['[fooPublic]']).to.equal('bar');
      });

      it('should be able to read and write a two-way input', () => {
        controller['[(fooPublic)]'] = 'bar';

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux';

        // changes local
        expect(controller.fooLocal).to.equal('quux');

        // and has effect on hidden string input property
        expect(controller['[(fooPublic)]']).to.equal('quux');
      });

      it('should not allow using more than one binding type', () => {
        controller['[fooPublic]'] = 'bar';
        expect(() => {
          controller['[(fooPublic)]'] = 'bar';
        }).to.throw;
      });
    });
  });
});