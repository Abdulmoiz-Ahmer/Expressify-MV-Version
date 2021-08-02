import mongoose from 'mongoose';
import { tokenInfo } from '../helpers/tokenInfo';

const User = new mongoose.Schema({
	email: {
		type: String,
	},
	password: {
		type: String,
	},
	name: {
		first: { type: String },
		last: { type: String },
	},
	tokens: [tokenInfo],
	remember_me: {
		type: Boolean,
		default: false,
	},
});

export const UserSchema = mongoose.model('User', User, 'users');
