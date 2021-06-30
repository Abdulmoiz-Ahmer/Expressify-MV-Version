import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';

const {expect} = chai;
chai.use(chaiHttp);

module.exports = {
    chai,
    expect
}