import { chai, expect } from '../common';

import {
  baseUrl,
  apiKey,
  dummyEmail,
  dummyPassword,
  dummyPassword2,
} from '../constants';

const pre_requisites = {};

describe('Authenticate User', () => {
  //Registering the new user.
  it('should register user', async () => {
    const res = await chai
      .request(baseUrl)
      .post('/auth/register')
      .set('x-api-key', apiKey)
      .send({
        email: dummyEmail,
        password: dummyPassword,
        confirm_password: dummyPassword,
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('access_token').that.is.a('string');
    expect(res.body.data).to.have.property('refresh_token').that.is.a('string');
    expect(res.body.data).to.have.property(
      'refresh_token_expiration_timestamp',
    );
    expect(res.body.data).to.have.property('access_token_expiration_timestamp');
    pre_requisites.access_token = res.body?.data?.access_token;
    pre_requisites.refresh_token = res.body?.data?.refresh_token;
  });

  //Verifying the user's access token after the registration.
  it('should respond working', async () => {
    const res = await chai
      .request(baseUrl)
      .get('/authTest')
      .set('x-api-key', apiKey)
      .set('Authorization', `Bearer ${pre_requisites.access_token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('message', 'Working');
  });

  //Signing the user in.
  it('should login user', async () => {
    const res = await chai
      .request(baseUrl)
      .post('/auth/login')
      .set('x-api-key', apiKey)
      .send({
        email: dummyEmail,
        password: dummyPassword,
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('access_token').that.is.a('string');
    expect(res.body.data).to.have.property('refresh_token').that.is.a('string');
    expect(res.body.data).to.have.property(
      'refresh_token_expiration_timestamp',
    );
    expect(res.body.data).to.have.property('access_token_expiration_timestamp');
    pre_requisites.access_token = res.body?.data?.access_token;
    pre_requisites.refresh_token = res.body?.data?.refresh_token;
  });

  //Verifying the user's access token after the login
  it('should respond working', async () => {
    const res = await chai
      .request(baseUrl)
      .get('/authTest')
      .set('x-api-key', apiKey)
      .set('Authorization', `Bearer ${pre_requisites.access_token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('message', 'Working');
  });

  //Renewing the user access token
  it('should renew user tokens', async () => {
    const res = await chai
      .request(baseUrl)
      .put('/auth/refresh-session')
      .set('x-api-key', apiKey)
      .set('refresh_token', pre_requisites.refresh_token);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('access_token').that.is.a('string');
    expect(res.body.data).to.have.property('refresh_token').that.is.a('string');
    expect(res.body.data).to.have.property(
      'refresh_token_expiration_timestamp',
    );
    expect(res.body.data).to.have.property('access_token_expiration_timestamp');
    pre_requisites.access_token = res.body?.data?.access_token;
    pre_requisites.refresh_token = res.body?.data?.refresh_token;
  });

  //Verifying the user's access token after the token renewing.
  it('should respond working', async () => {
    const res = await chai
      .request(baseUrl)
      .get('/authTest')
      .set('x-api-key', apiKey)
      .set('Authorization', `Bearer ${pre_requisites.access_token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('message', 'Working');
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
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property('otp');
    expect(res.body.data).to.have.property(
      'message',
      'Otp sent please check your email',
    );
    pre_requisites.otp = res.body?.data?.otp;
  });

  it('Reset Password Based On OTP', async () => {
    const res = await chai
      .request(baseUrl)
      .patch('/auth/reset-password')
      .set('x-api-key', apiKey)
      .send({
        otp: pre_requisites?.otp,
        password: dummyPassword2,
        confirm_password: dummyPassword2,
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('code', 200);
    expect(res.body.data).to.have.property(
      'message',
      'Password Changed Successfully',
    );
  });
});
