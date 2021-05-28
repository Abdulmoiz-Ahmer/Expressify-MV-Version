import { registerUser } from './helpers/registerUser';
import { loginUser } from './helpers/loginUser';
import { refreshSession } from './helpers/refreshSession';
import { sendCodePasswordRecovery } from './helpers/sendCodePasswordRecovery';
import { resetPassword } from './helpers/resetPassword';

export const auth = {
  registerUser,
  loginUser,
  refreshSession,
  sendCodePasswordRecovery,
  resetPassword,
};
