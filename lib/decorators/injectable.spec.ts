import Module from '../classes/module';
import {Injectable, INJECTABLE} from './injectable';
import {sinon} from '../tests/frameworks';
import {providerStore} from '../writers';
import {quickFixture} from '../tests/utils';

describe('@Injectable Decorator', function(){
	it('should decorate a class with a provider name and type', function(){
		@Injectable()
		class MyService{ }

		providerStore.get('type', MyService).should.eql('injectable');
		providerStore.get('name', MyService).should.eql('MyService');
	});

	it('should adhere to inheritance', function(){
		@Injectable()
		class BaseClass{ }

		@Injectable()
		class MyClass extends BaseClass{ }

		providerStore.get('name', BaseClass).should.eql('BaseClass');
		providerStore.get('name', MyClass).should.eql('MyClass');
	});

	it('should let you specify a name for the service', function(){
		@Injectable('Renamed')
		class BaseClass{ }

		providerStore.get('name', BaseClass).should.eql('Renamed');
	});

	describe('Parser', function(){
		let parser, module;

		beforeEach(function(){
			parser = Module.getParser(INJECTABLE);
			module = {
				service : sinon.spy()
			};
		});

		it('should register itself with Module', function(){
			parser.should.be.defined;
		});

		it('should parse an annotated class into an ng service', function(){
			@Injectable()
			class MyService{ }

			parser(MyService, 'MyService', [], module);

			module.service.should.have.been.calledWith('MyService', [MyService]);
		});
	});

	describe('Angular Integration', () => {

		let fixture;

		it('registers the injectable as an angular service', () => {
			@Injectable()
			class Foo {}

			fixture = quickFixture({ providers: [Foo] });

			fixture.debugElement.getLocal(Foo).should.be.an.instanceOf(Foo);
		});
	});
});