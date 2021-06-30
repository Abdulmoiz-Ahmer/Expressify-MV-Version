import { chai, expect } from '../common';
import {
  baseUrl,
  apiKey,
  dummyEmail,
  dummyPassword,
  dummyPassword2,
} from '../constants';

const pre_requisites = {};
describe('Profile Settings', () => {
  //Loging User so the we can use access token for next call
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

  //Changing the logged in user's password
  it('should change user password', async () => {
    const res = await chai
      .request(baseUrl)
      .patch('/profile-settings/change-password')
      .set('x-api-key', apiKey)
      .set('Authorization', `Bearer ${pre_requisites.access_token}`)
      .send({
        old_password: dummyPassword2,
        new_password: dummyPassword,
        confirm_password: dummyPassword,
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
