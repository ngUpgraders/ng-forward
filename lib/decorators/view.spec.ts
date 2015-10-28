import '../tests/frameworks';
import {componentStore} from '../writers';
import {View} from './component';

describe('@View Decorator', function(){
	it('should add a template option to a component', function(){
		@View({ template: 'test' })
		class MyClass{ }

		componentStore.get('template', MyClass).should.eql('test');
	});

	it('should support template URLs', function(){
		@View({ templateUrl : '/path/to/it' })
		class MyClass{ }

		componentStore.get('templateUrl', MyClass).should.eql('/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function(){
		@View({ template: 'test' })
		class Parent{ }

		@View({ templateUrl: '/path/to/it' })
		class Child extends Parent{ }

		@View({ template: 'new test' })
		class GrandChild extends Child{ }

		componentStore.get('template', Parent).should.eql('test');
		componentStore.get('templateUrl', Child).should.eql('/path/to/it');
		(componentStore.get('template', Child) === undefined).should.be.true;
		componentStore.get('template', GrandChild).should.eql('new test');
		(componentStore.get('templateUrl', GrandChild) === undefined).should.be.true;
	});
});