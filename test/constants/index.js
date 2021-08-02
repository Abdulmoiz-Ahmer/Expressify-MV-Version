import dotenv from 'dotenv';
import faker from 'faker';
import { generateEmail } from './generateEmail';

dotenv.config();

export const dummyPassword = 'Password@8';
export const dummyPassword2 = 'Password@88';
export const dummyEmail = generateEmail;
export const dummyName = {
	first: faker.name.firstName(),
	last: faker.name.lastName(),
};
export const apiKey = process.env.API_KEY;
export const baseUrl = `http://localhost:${process.env.PORT}/${process.env.BASE_URL}/${process.env.VERSION}`;
