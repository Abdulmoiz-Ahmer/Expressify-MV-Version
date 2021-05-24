import mongoose from 'mongoose';
import { UserSchema } from '~/schemas/User';
const LoginSession = new mongoose.Schema({
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  refresh_token_expiration_timestamp: {
    type: Date,
  },
  access_token_expiration_timestamp: { type: Date },
  remember_me: {
    type: Boolean,
    default: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserSchema,
  },
});

export const LoginSessionSchema = mongoose.model('login_session', LoginSession);
