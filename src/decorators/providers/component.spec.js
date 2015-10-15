/* global describe, it */
import {Component} from './component';
import '../../tests/frameworks';
import {providerWriter, componentWriter} from '../../writers';
import Module from '../../module';

describe('@Component annotation', function(){
	it('should decorate a class with correct $provider metadata', function(){
		@Component({ selector : 'my-component' })
		class MyComponentCtrl{ }

		providerWriter.has('type', MyComponentCtrl).should.be.ok;
		providerWriter.get('type', MyComponentCtrl).should.eql('component');
		providerWriter.has('name', MyComponentCtrl).should.be.ok;
		providerWriter.get('name', MyComponentCtrl).should.eql('myComponent');
	});

	it('should set sensible defaults using $component metadata', function(){
		@Component({ selector: 'my-component' })
		class MyComponentCtrl{ }

		componentWriter.get('restrict', MyComponentCtrl).should.eql('E');
		componentWriter.get('scope', MyComponentCtrl).should.eql({});
		componentWriter.get('bindToController', MyComponentCtrl).should.be.ok;
	});

	it('should throw an error if the selector is not an element', function(){
		let providerParser = Module.getParser('component');
		let caughtAttr = false;
		let caughtClass = false;

		try{
			@Component({ selector : '[my-attr]' })
			class MyClass{ }
			providerParser(MyClass);
		}
		catch(e){
			caughtAttr = true;
		}

		try{
			@Component({ selector : '.my-class' })
			class MyClass{ }
			providerParser(MyClass);
		}
		catch(e){
			caughtClass = true;
		}

		caughtAttr.should.be.ok;
		caughtClass.should.be.ok;
	});

	it('should respect inheritance', function(){
		@Component({
			selector: 'parent',
			inputs: [
				'first',
				'second'
			]
		})
		class ParentCtrl{ }

		@Component({ selector: 'child' })
		class ChildCtrl extends ParentCtrl{ }

		componentWriter.get('inputMap', ChildCtrl).should.eql({
			first: 'first',
			second: 'second'
		});
	});
});
