import chai from '../util/tests';
import {Require} from './require';

describe('@Require annotation for requiring directive controllers', function(){
	it('should add $component meta data', function(){
		@Require('^parentCtrl', 'siblingCtrl')
		class MyComponent{ }

		MyComponent.$component.require.should.eql(['^parentCtrl', 'siblingCtrl']);
	});

	it('should add a convience static method for unpacking requires', function(){

		@Require('^parentCtrl', 'siblingCtrl')
		class MyComponent{
			static link(scope, element, attrs, ctrls){
				let {parentCtrl, siblingCtrl} = MyComponent.unpackRequires(ctrls);

				parentCtrl.should.eql('Parent Controller');
				siblingCtrl.should.eql('Sibling Controller');
			}
		}

		MyComponent.link(0, 0, 0, ['Parent Controller', 'Sibling Controller']);
	});

	it('should adhere to inheritance', function(){
		@Require('^parent')
		class Test{ }

		@Require('sibling')
		class NewTest extends Test{ }

		Test.$component.require.should.eql(['^parent']);

		NewTest.$component.require.should.eql(['^parent', 'sibling']);
	});
});