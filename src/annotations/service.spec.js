import {Module} from '../module/module';
import {Service} from './service';
import {sinon} from '../util/tests';

describe('@Service Annotation', function(){
	it('should annotate a class', function(){
		@Service
		class MyService{ }

		MyService.should.have.property('$provider');
		MyService.$provider.name.should.equal('MyService');
		MyService.$provider.type.should.equal('service');
	});

	it('should adhere to inheritance', function(){
		@Service
		class BaseClass{ }

		@Service
		class MyClass extends BaseClass{ }

		BaseClass.$provider.name.should.equal('BaseClass');
		MyClass.$provider.name.should.equal('MyClass');
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
			parser.should.be.defined;
		});

		it('should parse an annotated class into an ng service', function(){
			@Service
			class MyService{ }

			parser(MyService, module);

			let name = module.service.args[0][0];
			let service = module.service.args[0][1];

			name.should.equal('MyService');
			service.should.eql(MyService);
		});
	});
});