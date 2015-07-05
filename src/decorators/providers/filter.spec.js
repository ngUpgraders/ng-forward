import '../../tests/frameworks';
import {ngMocks} from '../../tests/angular';
import {providerWriter} from '../../writers';
import Module from '../../module';
import {Filter} from './filter';

describe('@Filter Decorator', function(){
	it('should set the correct name and provider type', function(){
		@Filter('splice')
		class SpliceFilter{ }

		providerWriter.get('type', SpliceFilter).should.eql('filter');
		providerWriter.get('name', SpliceFilter).should.eql('splice');
	});

	it('should be parsed into a filter', function(){
		@Filter('splice')
		class SpliceFilter{ }

		Module('test', []).add(SpliceFilter);

		ngMocks.filter.should.have.been.calledWith('splice');
	});

	describe('Filter Parser Implementation', function(){
		let filter;

		beforeEach(function(){
			let parser = Module.getParser('filter');

			class Test{
				supports(input){
					return (typeof input === 'string');
				}

				transform(input, param){
					return `${input}-${param}`;
				}
			}

			parser(Test, 'test', [], {
				filter: (name, filterBlock) => {
					filter = filterBlock[0]();
				}
			});
		});

		it('should have created a filter', function(){
			filter.should.be.defined;
		});

		it('should check for support before applying the transform', function(){
			let test = obj => filter(obj);

			test.should.throw(Error, /does not support/);
		});

		it('should apply the transform if the test passes', function(){
			filter('hello', 'world').should.eql('hello-world');
		});
	});
});