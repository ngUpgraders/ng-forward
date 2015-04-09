import {expect} from 'chai';
import {Require} from './require';

describe('@Require annotation for requiring directive controllers', function(){
	it('should add $component meta data', function(){
		@Require('^parentCtrl', 'siblingCtrl')
		class MyComponent{ }

		expect(MyComponent.$component.require).to.eql(['^parentCtrl', 'siblingCtrl']);
	});

	it('should add a convience static method for unpacking requires', function(){

		@Require('^parentCtrl', 'siblingCtrl')
		class MyComponent{
			static link(scope, element, attrs, ctrls){
				let {parentCtrl, siblingCtrl} = MyComponent.unpackRequires(ctrls);

				expect(parentCtrl).to.eql('Parent Controller');
				expect(siblingCtrl).to.eql('Sibling Controller');
			}
		}

		MyComponent.link(0, 0, 0, ['Parent Controller', 'Sibling Controller']);
	});

	it('should adhere to inheritance', function(){
		@Require('^parent')
		class Test{ }

		@Require('sibling')
		class NewTest extends Test{ }

		expect(Test.$component.require).to.eql(['^parent']);

		expect(NewTest.$component.require).to.eql(['^parent', 'sibling']);
	});
});