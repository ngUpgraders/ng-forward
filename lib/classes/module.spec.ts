import {sinon} from '../tests/frameworks';
import {ng, ngMocks} from '../tests/angular';
import {providerStore} from '../writers';
import Module from './module';

const provider = (type, name) => t => {
	providerStore.set('type', type, t);
	providerStore.set('name', name, t);
};

describe('Decorator Supported Module', function(){
	it('should let you create an Angular module', function(){
		let module = Module('test', []);

		module.should.be.defined;
		module.name.should.equal('test');
		ng.module.should.have.been.called;
	});

	it('should let you publish the module to gain access to the ng module', function(){
		Module('test', []).publish().should.eql(ngMocks);
	});

	it('should let you config the module', function(){
		let config = ['$q', () => {}];
		Module('test', []).config(config);

		ngMocks.config.should.have.been.calledWith(config);
	});

	it('should let you create a run function', function(){
		let run = ['$q', () => {}];
		Module('test', []).run(run);

		ngMocks.run.should.have.been.calledWith(run);
	});

	it('should let you add value to the module', function  () {
		let value = 'testValue';
		Module('test', []).value('test', value);

		ngMocks.value.should.have.been.calledWith('test', value);
	});

	it('should let you add constant to the module', function  () {
		let value = 'constantValue';
		Module('test', []).constant('TEST', value);

		ngMocks.constant.should.have.been.calledWith('TEST', value);
	});

	describe('Adding providers', function(){
		let exampleRegister;

		beforeEach(function(){
			exampleRegister = sinon.spy();
			Module.addProvider('example', exampleRegister);
		});

		it('should let you add providers', function(){
			@provider('example', 'A')
			class A{ }

			let mod = Module('test', []).add(A);

			exampleRegister.should.have.been.calledWith(A, 'A', [], mod.publish());
		});

		it('should let you add multiple providers', function(){
			@provider('example', 'A')
			class A{ }

			@provider('example', 'B')
			class B{ }

			@provider('example', 'C')
			class C{ }

			Module('test', []).add(A, B, C);

			exampleRegister.should.have.been.calledThrice;
		});

		it('should throw an error if you add provider with no decorators', function(){
			class A{ }

			let test = () => Module('test', []).add(A);

			test.should.throw(Error, /Cannot read provider/);
		});

		it('should throw an error when adding a provider with an unrecognized type', function(){
			@provider('dne', 'A')
			class A{ }

			let test = () => Module('test', []).add(A);

			test.should.throw(Error, /No parser registered/);
		});
	});
});

describe('Integration: Module', () => {
	let angular;

	beforeEach(() => {
		angular = ng.useReal();
	});

	it('should let you create an Angular module', function(){
		let module = Module('test', []);
		angular.module('test').should.be.equal(module.publish());
	});
});