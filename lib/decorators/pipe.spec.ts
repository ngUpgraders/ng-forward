import '../tests/frameworks';
import {ngMocks} from '../tests/angular';
import {providerStore} from '../writers';
import Module from '../classes/module';
import {Pipe} from './pipe';

describe('@Pipe Decorator', function(){
	beforeEach(() => Pipe.clearNameCache());

	it('should set the correct name and provider type', function(){
		@Pipe('splice')
		class SplicePipe{ }

		providerStore.get('type', SplicePipe).should.eql('pipe');
		providerStore.get('name', SplicePipe).should.eql('splice');
	});

	it('should be parsed into a pipe', function(){
		@Pipe('splice')
		class SplicePipe{ }

		Module('test', []).add(SplicePipe);

		ngMocks.filter.should.have.been.calledWith('splice');
	});

	describe('Pipe Parser Implementation', function(){
		let pipe;

		beforeEach(function(){
			let parser = Module.getParser('pipe');

			class Test{
				supports(input){
					return (typeof input === 'string');
				}

				transform(input, param){
					return `${input}-${param}`;
				}
			}

			parser(Test, 'test', [], {
				filter: (name, pipeBlock) => {
					pipe = pipeBlock[0]();
				}
			});
		});

		it('should have created a pipe', function(){
			pipe.should.be.defined;
		});

		it('should check for support before applying the transform', function(){
			let test = obj => pipe(obj);

			test.should.throw(Error, /does not support/);
		});

		it('should apply the transform if the test passes', function(){
			pipe('hello', 'world').should.eql('hello-world');
		});
	});
});
