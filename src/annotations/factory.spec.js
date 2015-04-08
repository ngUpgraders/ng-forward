import {expect} from 'chai';
import {Factory} from './factory';
import {Module} from '../module/module';
import sinon from 'sinon';

describe('@Factory Annotation', function(){
	it('should decorate a class with $provider meta information', function(){
		@Factory('MyFactory')
		class ExampleClass{ }

		expect(ExampleClass).to.have.property('$provider');
		expect(ExampleClass.$provider).to.have.property('name', 'MyFactory');
		expect(ExampleClass.$provider).to.have.property('type', 'factory');
	});

	describe('Parser', function(){
		let parser, module;

		beforeEach(function(){
			module = { factory : sinon.spy() };
			parser = Module.getParser('factory');
		});

		it('should register itself with Module', function(){
			expect(parser).to.be.defined;
		});

		it('should use the static create method on a class as the factory function', function(){
			let called = false;

			@Factory('MyFactory')
			class ExampleClass{
				static create(){
					called = true;
				}
			}

			parser(ExampleClass, module);
			let factoryProvider = module.factory.args[0][1];

			factoryProvider()();

			expect(called).to.be.true;
		});

		it('should pass dependencies to the create method', function(){
			let a, b;

			@Factory('MyFactory')
			class ExampleClass{
				static create(dependencies){
					a = dependencies[0];
					b = dependencies[1];
				}
			}

			parser(ExampleClass, module);
			let factoryProvider = module.factory.args[0][1];

			factoryProvider(1, 2)();

			expect(a).to.equal(1);
			expect(b).to.equal(2);
		});

		it('should generate a factory function for a class', function(){
			@Factory('MyFactory')
			class ExampleClass{
				constructor(depA, depB, depC, propA, propB, propC){
					this.depA = depA;
					this.depB = depB;
					this.depC = depC;

					this.propA = propA;
					this.propB = propB;
					this.propC = propC;
				}
			}

			parser(ExampleClass, module);

			let factoryName = module.factory.args[0][0];
			let factoryProvider = module.factory.args[0][1];
			expect(factoryName).to.equal('MyFactory');
			expect(factoryProvider).to.be.defined;

			let factory = factoryProvider('a', 'b', 'c');
			expect(factory).to.be.defined;

			let instance = factory('1', '2', '3');
			expect(instance).to.have.property('propA', '1');
			expect(instance).to.have.property('propB', '2');
			expect(instance).to.have.property('propC', '3');
		});
	});
});