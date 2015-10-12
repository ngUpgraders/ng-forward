/* global it, describe */
import '../tests/frameworks';
import {propertiesMap, propertiesBuilder} from './properties-builder';
import {Component} from '../decorators/providers/component';
import {View} from '../decorators/component/view';
import {Inject} from '../decorators/inject';
import bundle from '../bundle';
import bootstrap from '../bootstrap';
import {ng} from '../tests/angular';

describe('properties-builder', () => {

  describe('propertiesMap', () => {
    it('should return map of three isolate scope properties per property', () => {
      let properties = {
        foo: 'foo'
      };

      let definition = propertiesMap(properties);
      expect(definition).to.eql({
        '_bind_string_foo': '@foo',
        '[foo]': '&',
        '[(foo)]': '=?'
      });
    });

    it('should return map of for properties with local vs. public name', () => {
      let properties = {
        fooLocal: 'fooPublic'
      };

      let definition = propertiesMap(properties);
      expect(definition).to.eql({
        '_bind_string_fooLocal': '@fooPublic',
        '[fooPublic]': '&',
        '[(fooPublic)]': '=?'
      });
    });

    it('should return empty map if there are no properties', () => {
      let properties = {};

      let definition = propertiesMap(properties);
      expect(definition).to.eql({});
    });
  });

  describe('propertiesBuilder', () => {
    let controller;

    beforeEach(() => {
      controller = {};
    });

    describe('with localKey same as publicKey', () => {

      beforeEach(() => {
        propertiesBuilder(controller, 'foo', 'foo');
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

      it('should only be able to read from string property', () => {
        controller['[foo]'] = sinon.stub();
        // simulate angular setting value with hidden property
        controller['_bind_string_foo'] = 'bar';

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux'; // this has no effect;
        expect(controller.foo).to.equal('bar');
      });

      it('should only be able to read from one-way property', () => {
        // simulate angular one way fn binding, special for one-way only
        controller['[foo]'] = sinon.stub().returns('bar');

        expect(controller.foo).to.equal('bar');
        controller.foo = 'quux'; // this has no effect;
        expect(controller.foo).to.equal('bar');
      });

      it('should be able to read and write a two-way property', () => {
        // simulate angular setting value with hidden property
        controller['[foo]'] = sinon.stub();
        // simulate angular one way fn binding, special for one-way only
        controller['[(foo)]'] = 'bar';

        expect(controller.foo).to.equal('bar');
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
        propertiesBuilder(controller, 'fooLocal', 'fooPublic');
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

      it('should only be able to read from string property', () => {
        controller['[fooPublic]'] = sinon.stub();
        // simulate angular setting value with hidden property
        controller['_bind_string_fooLocal'] = 'bar';

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux'; // this has no effect;
        expect(controller.fooLocal).to.equal('bar');
      });

      it('should only be able to read from one-way property', () => {
        // simulate angular one way fn binding, special for one-way only
        controller['[fooPublic]'] = sinon.stub().returns('bar');

        expect(controller.fooLocal).to.equal('bar');
        controller.fooLocal = 'quux'; // this has no effect;
        expect(controller.fooLocal).to.equal('bar');
      });

      it('should be able to read and write a two-way property', () => {
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