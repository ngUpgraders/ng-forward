import {View} from './view';
import '../../tests/frameworks';
import {componentWriter} from '../../writers';

describe('@View Decorator', function(){
	it('should add a template option to a component', function(){
		@View({ template: 'test' })
		class MyClass{ }

		componentWriter.get('template', MyClass).should.eql('test');
	});

	it('should support template URLs', function(){
		@View({ templateUrl : '/path/to/it' })
		class MyClass{ }

		componentWriter.get('templateUrl', MyClass).should.eql('/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function(){
		@View({ template: 'test' })
		class Parent{ }

		@View({ templateUrl: '/path/to/it' })
		class Child extends Parent{ }

		@View({ template: 'new test' })
		class GrandChild extends Child{ }

		componentWriter.get('template', Parent).should.eql('test');
		componentWriter.get('templateUrl', Child).should.eql('/path/to/it');
		(componentWriter.get('template', Child) === undefined).should.be.true;
		componentWriter.get('template', GrandChild).should.eql('new test');
		(componentWriter.get('templateUrl', GrandChild) === undefined).should.be.true;
	});
});