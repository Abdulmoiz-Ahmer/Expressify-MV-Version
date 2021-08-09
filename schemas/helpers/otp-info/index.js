export const otpInfo = {
	code: {
		type: String,
	},
	expiration_timestamp: {
		type: Date,
	},
	status: {
		type: String,
		default: 'sent',
	},
};
