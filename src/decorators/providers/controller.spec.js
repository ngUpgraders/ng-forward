/*global beforeEach, it, describe */
import {sinon} from '../../tests/frameworks';
import Module from '../../module';
import {providerWriter} from '../../writers';
import {Controller} from './controller';

describe('@Controller annotation', function(){
	beforeEach(() => Controller.clearNameCache());
	
	it('should decorate a class with $provider meta data', function(){
		@Controller
		class MyController{ }

		providerWriter.get('type', MyController).should.eql('controller');
		providerWriter.get('name', MyController).should.eql('MyController');
	});

	it('should register a controller parser with the Module class', function(){
		let parser = Module.getParser('controller');

		parser.should.exist;
	});

	it('should correctly parse a controller', function(){
		@Controller
		class MyController{ }

		let module = {
			controller : sinon.spy()
		};

		let parser = Module.getParser('controller');

		parser(MyController, 'MyController', [], module);

		let name = module.controller.args[0][0];
		let controller = module.controller.args[0][1];

		module.controller.called.should.be.true;
		name.should.equal('MyController');
		controller.should.eql([MyController]);
	});

	it('should define the $provider property on the prototype of the target', function(){
		@Controller
		class MyController{ }

		@Controller
		class NewController extends MyController{ }

		providerWriter.get('name', MyController).should.not.equal('NewController');
		providerWriter.get('name', MyController).should.equal('MyController');
		providerWriter.get('name', NewController).should.equal('NewController');
	});
});
