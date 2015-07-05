import {Transclude} from './transclude';
import {componentWriter} from '../../writers';
import {expect} from '../../tests/frameworks';

describe('@Transclude Component decorator', function(){
	it('should add the transclude key on the DDO', function(){
		@Transclude
		class MyClass{ }

		componentWriter.has('transclude', MyClass).should.be.ok;
		componentWriter.get('transclude', MyClass).should.be.ok;
	});

	it('should let you pass a string or boolean value to the decorator', function(){
		@Transclude(true)
		class First{ }

		@Transclude('element')
		class Second{ }

		componentWriter.get('transclude', First).should.be.ok;
		componentWriter.get('transclude', Second).should.eql('element');
	});
});