/* global it, describe */
import '../tests/frameworks';
import {inputsMap, inputsBuilder} from './inputs-builder';
import {Component} from '../decorators/providers/component';
import {View} from '../decorators/component/view';
import {Inject} from '../decorators/inject';
import bundle from '../bundle';
import bootstrap from '../bootstrap';
import {ng} from '../tests/angular';

describe('inputs-builder', () => {

  describe('inputsMap', () => {
    it('should return map of three isolate scope properties per input', () => {
      let inputs = {
        foo: 'foo'
      };

      let definition = inputsMap(inputs);
      expect(definition).to.eql({
        '_bind_string_foo': '@foo',
        '[foo]': '&',
        '[(foo)]': '=?'
      });
    });

    it('should return map of inputs with local vs. public name', () => {
      let inputs = {
        fooLocal: 'fooPublic'
      };

      let definition = inputsMap(inputs);
      expect(definition).to.eql({
        '_bind_string_fooLocal': '@fooPublic',
        '[fooPublic]': '&',
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

      it('should add one visible and several hidden properties to controller', () => {
        let visibleProps = [];
        for (let key in controller) {
          visibleProps.push(key);
        }

        expect(controller).to.have.property('_bind_string_foo');
        expect(controller).to.have.property('[foo]');
        expect(controller).to.have.property('[(foo)]');
        expect(visibleProps).to.have.length(1);
        expect(visibleProps[0]).to.equal('foo');
      });

      it('should only be able to read from string input', () => {
        controller['[foo]'] = sinon.stub();
        // simulate angular setting value with hidden property
        controller['_bind_string_foo'] = 'bar';

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux'; // this has no effect;
        expect(controller.foo).to.equal('bar');
      });

      it('should only be able to read from one-way input', () => {
        // simulate angular one way fn binding, special for one-way only
        controller['[foo]'] = sinon.stub().returns('bar');

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux'; // this has no effect;
        expect(controller.foo).to.equal('bar');
      });

      it('should be able to read and write a two-way input', () => {
        // simulate angular setting value with hidden property
        controller['[foo]'] = sinon.stub();
        // simulate angular one way fn binding, special for one-way only
        controller['[(foo)]'] = 'bar';

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux';
        expect(controller.foo).to.equal('quux');
        expect(controller['[(foo)]']).to.equal('quux');
      });

      it('should allow writing to a two-way input that is initialized to a falsy defined value', function() {
        // simulate angular setting value with hidden property
        controller['[foo]'] = sinon.stub();
        // simulate angular one way fn binding, special for one-way only
        controller['[(foo)]'] = '';

        expect(controller.foo).to.equal('');
        controller.foo = 'quux';
        expect(controller.foo).to.equal('quux');
        expect(controller['[(foo)]']).to.equal('quux');
      });

      it('should not allow using more than one binding type', () => {
        controller['[foo]'] = sinon.stub().returns('bar');
        expect(controller['[(foo)]']).to.throw;
      });
    });

    describe('with localKey different than publicKey', () => {
      beforeEach(() => {
        inputsBuilder(controller, 'fooLocal', 'fooPublic');
      });

      it('should add one visible and several hidden properties to controller', () => {
        let visibleProps = [];
        for (let key in controller) {
          visibleProps.push(key);
        }

        expect(controller).to.have.property('_bind_string_fooLocal');
        expect(controller).to.have.property('[fooPublic]');
        expect(controller).to.have.property('[(fooPublic)]');
        expect(visibleProps).to.have.length(1);
        expect(visibleProps[0]).to.equal('fooLocal');
      });

      it('should only be able to read from string input', () => {
        controller['[fooPublic]'] = sinon.stub();
        // simulate angular setting value with hidden property
        controller['_bind_string_fooLocal'] = 'bar';

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux'; // this has no effect;
        expect(controller.fooLocal).to.equal('bar');
      });

      it('should only be able to read from one-way input', () => {
        // simulate angular one way fn binding, special for one-way only
        controller['[fooPublic]'] = sinon.stub().returns('bar');

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux'; // this has no effect;
        expect(controller.fooLocal).to.equal('bar');
      });

      it('should be able to read and write a two-way input', () => {
        // simulate angular setting value with hidden property
        controller['[fooPublic]'] = sinon.stub();
        // simulate angular one way fn binding, special for one-way only
        controller['[(fooPublic)]'] = 'bar';

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux';
        expect(controller.fooLocal).to.equal('quux');
        expect(controller['[(fooPublic)]']).to.equal('quux');
      });

      it('should not allow using more than one binding type', () => {
        controller['[fooPublic]'] = sinon.stub().returns('bar');
        expect(controller['[(fooPublic)]']).to.throw;
      });
    });
  });
});