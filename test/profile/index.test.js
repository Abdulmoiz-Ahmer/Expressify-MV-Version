// eslint-disable-next-line import/named
import { chai, expect } from '../common';
import {
	baseUrl,
	apiKey,
	dummyEmail,
	dummyPassword,
	dummyPassword2,
} from '../constants';

const preRequisites = {};
describe('Profile Settings', () => {
	//  Logging User so the we can use access token for next call
	it('should login user', async () => {
		const res = await chai
			.request(baseUrl)
			.post('/auth/login')
			.set('x-api-key', apiKey)
			.send({
				email: dummyEmail,
				password: dummyPassword2,
			});
		expect(res).to.have.status(200);
		expect(res.body).to.have.property('results');
		expect(res.body.results).to.have.property('name');
		expect(res.body.results.name)
			.to.have.property('first')
			.that.is.a('string');
		expect(res.body.results.name)
			.to.have.property('last')
			.that.is.a('string');
		expect(res.body.results).to.have.property('token');
		expect(res.body.results.token)
			.to.have.property('access_token')
			.that.is.a('string');
		expect(res.body.results.token)
			.to.have.property('refresh_token')
			.that.is.a('string');
		expect(res.body.results.token).to.have.property(
			'refresh_token_expiration_timestamp',
		);
		expect(res.body.results.token).to.have.property(
			'access_token_expiration_timestamp',
		);
		expect(res.body.results).to.have.property('remember_me');

		preRequisites.access_token = res.body?.results?.token?.access_token;
		preRequisites.refresh_token = res.body?.results?.token?.refresh_token;
	});

	//  Changing the logged in user's password
	it('should change user password', async () => {
		const res = await chai
			.request(baseUrl)
			.patch('/profile-settings/change-password')
			.set('x-api-key', apiKey)
			.set('Authorization', `Bearer ${preRequisites.access_token}`)
			.send({
				oldPassword: dummyPassword2,
				newPassword: dummyPassword,
				confirmPassword: dummyPassword,
			});
		expect(res).to.have.status(200);
		expect(res.body.results).to.have.property(
			'message',
			'Password Changed Successfully',
		);
	});
});
