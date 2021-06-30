import dotenv from 'dotenv';
import { generateEmail } from './generateEmail';
dotenv.config();

export const dummyPassword = 'Password@8';
export const dummyPassword2 = 'Password@88';
export const dummyEmail = generateEmail;
export const apiKey = process.env.API_KEY;
export const baseUrl = `http://localhost:${process.env.PORT}/${process.env.BASE_URL}/${process.env.VERSION}`;
