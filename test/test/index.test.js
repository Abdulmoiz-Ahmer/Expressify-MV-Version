// eslint-disable-next-line import/named
import { chai, expect } from '../common';
import { baseUrl, apiKey } from '../constants';

//  Pinging to test whether the server is up or not
describe('should respond working', () => {
	it('test route', async () => {
		const response = await chai
			.request(baseUrl)
			.get('/test')
			.set('x-api-key', apiKey);

		expect(response).to.have.status(200);
		expect(response.body.results).to.have.property('message', 'Working');
	});
});
