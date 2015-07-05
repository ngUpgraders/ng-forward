import Module from '../../module';
import {Service} from './service';
import {sinon} from '../../tests/frameworks';
import {providerWriter} from '../../writers';

describe('@Service Decorator', function(){
	it('should decorate a class with a provider name and type', function(){
		@Service
		class MyService{ }

		providerWriter.get('type', MyService).should.eql('service');
		providerWriter.get('name', MyService).should.eql('MyService');
	});

	it('should adhere to inheritance', function(){
		@Service
		class BaseClass{ }

		@Service
		class MyClass extends BaseClass{ }

		providerWriter.get('name', BaseClass).should.eql('BaseClass');
		providerWriter.get('name', MyClass).should.eql('MyClass');
	});

	it('should let you specify a name for the service', function(){
		@Service('Renamed')
		class BaseClass{ }

		providerWriter.get('name', BaseClass).should.eql('Renamed');
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

			parser(MyService, 'MyService', [], module);

			module.service.should.have.been.calledWith('MyService', [MyService]);
		});
	});
});