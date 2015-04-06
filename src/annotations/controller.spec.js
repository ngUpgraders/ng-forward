import sinon from 'sinon';
import {expect} from 'chai';
import {Controller} from './controller';
import {Module} from '../module/module';

describe('@Controller annotation', function(){
	it('should decorate a class with $provider meta data', function(){
		@Controller
		class MyController{ }

		expect(MyController).to.have.property('$provider');
		expect(MyController.$provider.name).to.equal('MyController');
		expect(MyController.$provider.type).to.equal('controller');
	});

	it('should register a controller parser with the Module class', function(){
		let parser = Module.getParser('controller');

		expect(parser).to.exist;
	});

	it('should correctly parse a controller', function(){
		@Controller
		class MyController{ }

		let module = {
			controller : sinon.spy()
		};

		let parser = Module.getParser('controller');

		parser(MyController, module);

		let name = module.controller.args[0][0];
		let controller = module.controller.args[0][1];

		expect(module.controller.called).to.be.true;
		expect(name).to.equal('MyController');
		expect(controller).to.eql(MyController);
	});
});