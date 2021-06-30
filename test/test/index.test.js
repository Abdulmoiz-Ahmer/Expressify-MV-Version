import { chai, expect } from '../common';
import { baseUrl, apiKey } from '../constants';

//Pinging to test whether the server is up or not
describe('should respond working', () => {
  it('test route', async () => {
    const res = await chai
      .request(baseUrl)
      .get('/test')
      .set('x-api-key', apiKey);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('message', 'Working');
  });
});
