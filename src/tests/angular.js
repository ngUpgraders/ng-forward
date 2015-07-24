import {sinon} from '../tests/frameworks';

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

export let angular = {
	module: sinon.stub().returns(ngMocks)
};

global.angular = angular;