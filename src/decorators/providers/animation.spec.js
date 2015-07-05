import {Animation} from './animation';
import Module from '../../module';
import {providerWriter} from '../../writers';
import {sinon} from '../../tests/frameworks';

describe('@Animation Decorator', function(){
	it('should set the correct provider name and type', function(){
		@Animation('.my-class')
		class MyClassAnimation{ }

		providerWriter.get('type', MyClassAnimation).should.eql('animation');
		providerWriter.get('name', MyClassAnimation).should.eql('.my-class');
	});

	it('should throw an error if you do not provide a class name', function(){
		let test = () => {
			@Animation
			class MyAnimation{ }
		};

		test.should.throw(Error, /must be supplied with the name of a class/);
	});

	it('should throw an error if the class selector is invalid', function(){
		let element = () => {
			@Animation('my-class')
			class Element{ }
		};

		let attr = () => {
			@Animation('[my-class]')
			class Attr{ }
		};

		element.should.throw(Error, /Invalid selector passed/);
		attr.should.throw(Error, /Invalid selector passed/);
	});

	describe('Parser', function(){
		let parser, module;

		beforeEach(function(){
			parser = Module.getParser('animation');
			module = { animation: sinon.spy() };
		});

		it('should add a parser to Module', function(){
			parser.should.be.defined;
		});

		it('should correctly register a new animation', function(){
			parser(function(){}, 'Test', [], module);

			module.animation.should.have.been.called;
		});
	});
});