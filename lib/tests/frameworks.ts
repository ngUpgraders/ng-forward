import * as chai from 'chai';
import sinonChai from 'sinon-chai';
import * as sinon from 'sinon';

chai.use(sinonChai);

chai.should();

let expect = chai.expect;

export default chai;
export {expect, sinon};