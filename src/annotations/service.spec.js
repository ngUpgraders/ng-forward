import {expect} from 'chai';
import {Module} from '../module/module';
import {Service} from './service';
import sinon from 'sinon';

describe('@Service Annotation', function(){
	it('should annotate a class', function(){
		@Service
		class MyService{ }

		expect(MyService).to.have.property('$provider');
		expect(MyService.$provider.name).to.equal('MyService');
		expect(MyService.$provider.type).to.equal('service');
	});

	it('should adhere to inheritance', function(){
		@Service
		class BaseClass{ }

		@Service
		class MyClass extends BaseClass{ }

		expect(BaseClass.$provider.name).to.equal('BaseClass');
		expect(MyClass.$provider.name).to.equal('MyClass');
	});

	describe('Parser', function(){
		let parser, module;

		beforeEach(function(){
			parser = Module.getParser('service');
			module = {
				service : sinon.spy()
			};
		});

		it('should register itself with Module', function(){
			expect(parser).to.be.defined;
		});

		it('should parse an annotated class into an ng service', function(){
			@Service
			class MyService{ }

			parser(MyService, module);

			let name = module.service.args[0][0];
			let service = module.service.args[0][1];

			expect(name).to.equal('MyService');
			expect(service).to.eql(MyService);
		});
	});
});