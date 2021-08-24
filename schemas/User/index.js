/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { tokenInfo, otpInfo, hash } from '../helpers';

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
	otps: [otpInfo],
	remember_me: {
		type: Boolean,
		default: false,
	},
});

// DO NOT CONVERT TO ARROW FUNCTION:
// arrow functions have provide different contexts for `this`
// and these hooks will no work if they cannot access the
// correct context for `this`
User.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await hash(this.password);
	}

	return next();
});

// DO NOT CONVERT TO ARROW FUNCTION:
// arrow functions have provide different contexts for `this`
// and these hooks will no work if they cannot access the
// correct context for `this`
User.pre('updateOne', async function (next) {
	if (this._update.password) {
		this._update.password = await hash(this._update.password);
		return next();
	}

	if (this._update?.$set?.password) {
		this._update.$set.password = await hash(this._update.$set.password);
		return next();
	}

	if (this._update?.$addToSet?.password) {
		this._update.$addToSet.password = await hash(
			this._update.$addToSet.password,
		);
		return next();
	}

	return next();
});

export const UserSchema = mongoose.model('User', User, 'users');
