module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		mocha: true,
	},

	extends: ['airbnb-base', 'prettier'],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		'import/prefer-default-export': 'off',
	},
	plugins: ['prettier'],
	settings: {
		'import/resolver': {
			'babel-module': {},
		},
	},
};
