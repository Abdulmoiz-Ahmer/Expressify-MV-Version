import faker from 'faker';

export const user = () => ({
	email: faker.internet.email(),
	password: 'Password@8',
	name: {
		first: faker.name.firstName(),
		last: faker.name.lastName(),
	},
});
