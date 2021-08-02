import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
chai.use(chaiHttp);

exports.chai = chai;
exports.expect = expect;
