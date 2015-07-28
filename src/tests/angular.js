import {sinon} from './frameworks';
import realAngular from '../../node_modules/angular'

export let ngMocks = {
	factory: sinon.spy(),
	config: sinon.spy(),
	run: sinon.spy(),
	service: sinon.spy(),
	animation: sinon.spy(),
	directive: sinon.spy(),
	provider: sinon.spy(),
	filter: sinon.spy(),
  value: sinon.spy(),
  constant: sinon.spy()
};

export let ng = {
	module: sinon.stub().returns(ngMocks),
	useStub() {
		global.angular = this;
	},
	useReal() {
		return global.angular = realAngular;
	}
};

ng.useStub();