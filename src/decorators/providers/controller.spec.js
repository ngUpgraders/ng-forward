import {sinon} from '../../util/tests';
import '../../util/tests';
import {providerWriter, componentWriter} from '../../writers';
import {Controller} from './controller';

describe('@Controller annotation', function(){
	xit('should decorate a class with $provider meta data', function(){
		@Controller
		class MyController{ }

		hasMeta('$provider', MyController).should.be.ok;
		getMeta('$provider', MyController).should.eql({
			name : 'MyController',
			type : 'controller'
		});
	});

	xit('should register a controller parser with the Module class', function(){
		let parser = Module.getParser('controller');

		parser.should.exist;
	});

	xit('should correctly parse a controller', function(){
		@Controller
		class MyController{ }

		let module = {
			controller : sinon.spy()
		};

		let parser = Module.getParser('controller');

		parser(MyController, module);

		let name = module.controller.args[0][0];
		let controller = module.controller.args[0][1];

		module.controller.called.should.be.true;
		name.should.equal('MyController');
		controller.should.eql([MyController]);
	});

	xit('should define the $provider property on the prototype of the target', function(){
		@Controller
		class MyController{ }

		@Controller
		class NewController extends MyController{ }

		getMeta('$provider', MyController).name.should.not.equal('NewController');
		getMeta('$provider', MyController).name.should.equal('MyController');
		getMeta('$provider', NewController).name.should.equal('NewController');
	});
});
