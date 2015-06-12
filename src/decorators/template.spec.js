import chai from '../util/tests';

xdescribe('@Template Annotation', function(){
	it('should add a template option to a component', function(){
		@Template({ inline : 'test' })
		class MyClass{ }

		MyClass.should.have.property('$component');
		MyClass.$component.should.have.property('template');
	});

	it('should support inline templates', function(){
		@Template({ inline : 'test' })
		class MyClass{ }

		MyClass.$component.should.have.property('template', 'test');
	});

	it('should support template URLs', function(){
		@Template({ url : '/path/to/it' })
		class MyClass{ }

		MyClass.$component.should.have.property('templateUrl', '/path/to/it');
	});

	it('should overwrite previously set template options via inheritance', function(){
		@Template({ inline : 'test' })
		class MyClass{ }

		@Template({ url : '/path/to/it' })
		class NewClass extends MyClass{ }

		@Template({ inline : 'new test' })
		class TestClass extends NewClass{ }

		MyClass.$component.should.have.property('template', 'test');
		NewClass.$component.should.have.property('templateUrl', '/path/to/it');
		NewClass.$component.should.not.have.property('template');
		TestClass.$component.should.have.property('template', 'new test');
		TestClass.$component.should.not.have.property('templateUrl');
	});
});