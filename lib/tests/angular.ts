import {sinon} from './frameworks';
//noinspection TypeScriptCheckImport
import realAngular from 'angular';
//import mocks from 'angular-mocks';

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
		//noinspection TypeScriptUnresolvedVariable
		global.angular = this;
	},
	useReal() {
		//noinspection TypeScriptUnresolvedVariable
		return global.angular = realAngular;
	}
};

beforeEach(() => {
	ng.useStub();
});
