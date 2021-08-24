import bcrypt from 'bcrypt';

const rounds = parseInt(process.env.SALT_ROUNDS, 10);

export const hash = async (password) => bcrypt.hash(password, rounds);
