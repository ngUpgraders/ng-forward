import {Template} from './Template';
import {expect} from 'chai';

describe('@Template Annotation', function(){
	it('should add a template option to a component', function(){
		@Template({ inline : 'test' })
		class MyClass{ }

		expect(MyClass).to.have.property('$component');
		expect(MyClass.$component).to.have.property('template');
	});

	it('should support inline templates', function(){
		@Template({ inline : 'test' })
		class MyClass{ }

		expect(MyClass.$component).to.have.property('template', 'test');
	});

	it('should support template URLs', function(){
		@Template({ url : '/path/to/it' })
		class MyClass{ }

		expect(MyClass.$component).to.have.property('templateUrl', '/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function(){
		@Template({ inline : 'test' })
		class MyClass{ }

		@Template({ url : '/path/to/it' })
		class NewClass extends MyClass{ }

		@Template({ inline : 'new test' })
		class TestClass extends NewClass{ }

		expect(MyClass.$component).to.have.property('template', 'test');
		expect(NewClass.$component).to.have.property('templateUrl', '/path/to/it');
		expect(NewClass.$component).not.to.have.property('template');
		expect(TestClass.$component).to.have.property('template', 'new test');
		expect(TestClass.$component).not.to.have.property('templateUrl');
	});
});