import dotenv from 'dotenv';

// Check if ENV was passed while executing codebase otherwise default to `dev`
const environment = process.env.NODE_ENV || 'dev';
export const envLoader = dotenv.config({ path: `./.env.${environment}` });
