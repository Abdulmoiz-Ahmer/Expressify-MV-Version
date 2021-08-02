// eslint-disable-next-line import/named
import { chai, expect } from '../common';

import {
	baseUrl,
	apiKey,
	dummyEmail,
	dummyName,
	dummyPassword,
	dummyPassword2,
} from '../constants';

const preRequisites = {};

describe('Authenticate User', () => {
	//  Registering the new user.
	it('should register user', async () => {
		const response = await chai
			.request(baseUrl)
			.post('/auth/register')
			.set('x-api-key', apiKey)
			.send({
				email: dummyEmail,
				password: dummyPassword,
				confirmPassword: dummyPassword,
				name: dummyName,
			});

		expect(response).to.have.status(200);
		expect(response.body).to.have.property('results');
		expect(response.body.results).to.have.property('name');
		expect(response.body.results.name)
			.to.have.property('first')
			.that.is.a('string');
		expect(response.body.results.name)
			.to.have.property('last')
			.that.is.a('string');
		expect(response.body.results).to.have.property('token');
		expect(response.body.results.token)
			.to.have.property('access_token')
			.that.is.a('string');
		expect(response.body.results.token)
			.to.have.property('refresh_token')
			.that.is.a('string');
		expect(response.body.results.token).to.have.property(
			'refresh_token_expiration_timestamp',
		);
		expect(response.body.results.token).to.have.property(
			'access_token_expiration_timestamp',
		);
		preRequisites.access_token =
			response.body?.results?.token?.access_token;
		preRequisites.refresh_token =
			response.body?.results?.token?.refresh_token;
	});

	//	Verifying the user's access token after the registration.
	it('should respond working', async () => {
		const response = await chai
			.request(baseUrl)
			.get('/authTest')
			.set('x-api-key', apiKey)
			.set('Authorization', `Bearer ${preRequisites.access_token}`);
		expect(response).to.have.status(200);
		expect(response.body.results).to.have.property('message', 'Working');
	});

	//	Signing the user in.
	it('should login user', async () => {
		const response = await chai
			.request(baseUrl)
			.post('/auth/login')
			.set('x-api-key', apiKey)
			.send({
				email: dummyEmail,
				password: dummyPassword,
			});
		expect(response).to.have.status(200);
		expect(response.body).to.have.property('results');
		expect(response.body.results).to.have.property('name');
		expect(response.body.results.name)
			.to.have.property('first')
			.that.is.a('string');
		expect(response.body.results.name)
			.to.have.property('last')
			.that.is.a('string');
		expect(response.body.results).to.have.property('token');
		expect(response.body.results.token)
			.to.have.property('access_token')
			.that.is.a('string');
		expect(response.body.results.token)
			.to.have.property('refresh_token')
			.that.is.a('string');
		expect(response.body.results.token).to.have.property(
			'refresh_token_expiration_timestamp',
		);
		expect(response.body.results.token).to.have.property(
			'access_token_expiration_timestamp',
		);
		expect(response.body.results).to.have.property('remember_me');
		preRequisites.access_token =
			response.body?.results?.token?.access_token;
		preRequisites.refresh_token =
			response.body?.results?.token?.refresh_token;
	});

	//	Verifying the user's access token after the login
	it('should respond working', async () => {
		const response = await chai
			.request(baseUrl)
			.get('/authTest')
			.set('x-api-key', apiKey)
			.set('Authorization', `Bearer ${preRequisites.access_token}`);
		expect(response).to.have.status(200);
		expect(response.body.results).to.have.property('message', 'Working');
	});

	//	Renewing the user access token
	it('should renew user tokens', async () => {
		const response = await chai
			.request(baseUrl)
			.put('/auth/refresh-session')
			.set('x-api-key', apiKey)
			.set('refreshToken', preRequisites.refresh_token);
		expect(response).to.have.status(200);
		expect(response.body).to.have.property('results');
		expect(response.body.results).to.have.property('token');
		expect(response.body.results.token)
			.to.have.property('access_token')
			.that.is.a('string');
		expect(response.body.results.token)
			.to.have.property('refresh_token')
			.that.is.a('string');
		expect(response.body.results.token).to.have.property(
			'refresh_token_expiration_timestamp',
		);
		expect(response.body.results.token).to.have.property(
			'access_token_expiration_timestamp',
		);
		preRequisites.access_token =
			response.body?.results?.token?.access_token;
		preRequisites.refresh_token =
			response.body?.results?.token?.refresh_token;
	});

	//	Verifying the user's access token after the token renewing.
	it('should respond working', async () => {
		const response = await chai
			.request(baseUrl)
			.get('/authTest')
			.set('x-api-key', apiKey)
			.set('Authorization', `Bearer ${preRequisites.access_token}`);
		expect(response).to.have.status(200);
		expect(response.body.results).to.have.property('message', 'Working');
	});
});

describe('Password Recovery', () => {
	it('Forgot Password', async () => {
		const res = await chai
			.request(baseUrl)
			.patch('/auth/forgot-password')
			.set('x-api-key', apiKey)
			.set('email', dummyEmail);
		expect(res).to.have.status(200);
		expect(res.body.results).to.have.property('otp');
		expect(res.body.results).to.have.property(
			'message',
			'Otp sent please check your email',
		);
		preRequisites.otp = res.body?.results?.otp;
	});

	it('Reset Password Based On OTP', async () => {
		const res = await chai
			.request(baseUrl)
			.patch('/auth/reset-password')
			.set('x-api-key', apiKey)
			.send({
				otp: preRequisites?.otp,
				password: dummyPassword2,
				confirmPassword: dummyPassword2,
			});

		expect(res).to.have.status(200);
		expect(res.body.results).to.have.property(
			'message',
			'Password Changed Successfully',
		);
	});
});
