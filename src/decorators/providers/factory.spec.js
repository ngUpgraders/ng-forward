/*global describe, it, beforeEach*/
import {Factory} from './factory';
import Module from '../../module';
import {sinon} from '../../tests/frameworks';
import {providerWriter} from '../../writers';

describe('@Factory Annotation', function(){
	beforeEach(() => Factory.clearNameCache());
	
	it('should decorate a class with $provider meta information', function(){
		@Factory('MyFactory')
		class ExampleClass{ }

		providerWriter.get('type', ExampleClass).should.eql('factory');
		providerWriter.get('name', ExampleClass).should.eql('MyFactory');
	});

	describe('Parser', function(){
		let parser, module;

		beforeEach(function(){
			module = { factory : sinon.spy() };
			parser = Module.getParser('factory');
		});

		it('should register itself with Module', function(){
			parser.should.be.defined;
		});

		it('should use the static create method on a class as the factory function', function(){
			let called = false;

			@Factory('MyFactory')
			class ExampleClass{
				static create(){
					called = true;
				}
			}

			parser(ExampleClass, 'MyFactory', [], module);
			let factoryProvider = module.factory.args[0][1][0];

			factoryProvider()();

			called.should.be.true;
		});

		it('should pass dependencies to the create method', function(){
			let a, b;

			@Factory('MyFactory')
			class ExampleClass{
				static create(dependencies){
					[a, b] = dependencies;
				}
			}

			parser(ExampleClass, 'MyFactory', [], module);
			let factoryProvider = module.factory.args[0][1][0];

			factoryProvider(1, 2)();

			a.should.equal(1);
			b.should.equal(2);
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

			parser(ExampleClass, 'MyFactory', [], module);

			let factoryName = module.factory.args[0][0];
			let factoryProvider = module.factory.args[0][1][0];
			factoryName.should.equal('MyFactory');
			factoryProvider.should.be.defined;

			let factory = factoryProvider('a', 'b', 'c');
			factory.should.be.defined;

			let instance = factory('1', '2', '3');
			instance.should.have.property('propA', '1');
			instance.should.have.property('propB', '2');
			instance.should.have.property('propC', '3');
		});
	});
});
