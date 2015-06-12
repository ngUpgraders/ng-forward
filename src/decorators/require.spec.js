import chai from '../util/tests';
// import {Require} from './require';

xdescribe('@Require annotation for requiring directive controllers', function(){
	it('should add $component meta data', function(){
		@Require('^parentCtrl', 'siblingCtrl')
		class MyComponent{ }

		getMeta('$component:require', MyComponent).should.eql(['^parentCtrl', 'siblingCtrl']);
	});

	it('should adhere to inheritance', function(){
		@Require('^parent')
		class Test{ }

		@Require('sibling')
		class NewTest extends Test{ }

		getMeta('$component:require', Test).should.eql(['^parent']);
		getMeta('$component:require', NewTest).should.eql(['^parent', 'sibling']);
	});
});