import faker from 'faker';

export const generateEmail = faker.internet.email();
export const generateName = {
	first: faker.name.firstName(),
	last: faker.name.lastName(),
};
