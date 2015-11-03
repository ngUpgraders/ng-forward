import Decorator from './decorator';
import {sinon} from '../tests/frameworks';

describe('Decorator Class', () => {
	let testSpy, Test;
	
	beforeEach(() => {
		testSpy = sinon.spy();
		Test = () => testSpy;
		Decorator.addDecorator('Test', Test);
	});
	
	it('should let you create classes', () => {
		let constructorSpy = sinon.spy();
		let methodSpy = sinon.spy();
		let decorator = new Decorator();
		
		let createdClass = decorator.class({
			constructor: constructorSpy,
			method: methodSpy,
			value: 123
		});
		
		let instance = new createdClass();
		instance.method();
		
		constructorSpy.should.have.been.called;
		methodSpy.should.have.been.called;
		instance.value.should.eql(123);
	});
	
	it('should let you apply decorators to the class', () => {
		let decorator:any = <any> new Decorator();
		let target = decorator.Test().class({});
		
		testSpy.should.have.been.calledWith(target);
	});
});