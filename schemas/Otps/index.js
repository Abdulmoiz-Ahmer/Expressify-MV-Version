import mongoose from 'mongoose';
import { UserSchema } from '~/schemas/User';

const Otps = new mongoose.Schema({
  otp: {
    type: String,
  },
  otp_expiration_timestamp: {
    type: Date,
  },
  status: {
    type: String,
    default: 'sent',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserSchema,
  },
});

export const OtpsSchema = mongoose.model('otps', Otps);
