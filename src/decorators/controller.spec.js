import {sinon} from '../util/tests';
// import {Controller} from './controller';
// import {Module} from '../module/module';
// import {hasMeta, getMeta} from '../util/metadata';

xdescribe('@Controller annotation', function(){
	it('should decorate a class with $provider meta data', function(){
		@Controller
		class MyController{ }

		hasMeta('$provider', MyController).should.be.ok;
		getMeta('$provider', MyController).should.eql({ 
			name : 'MyController', 
			type : 'controller' 
		});
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

		parser(MyController, module);

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

		getMeta('$provider', MyController).name.should.not.equal('NewController');
		getMeta('$provider', MyController).name.should.equal('MyController');
		getMeta('$provider', NewController).name.should.equal('NewController');
	});
});