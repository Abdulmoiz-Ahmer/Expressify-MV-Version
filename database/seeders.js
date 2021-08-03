/* eslint-disable import/named */
// eslint-disable-next-line no-unused-vars
import { connection } from '~/config';
import { UserSchema } from '~/schemas/User';
import { user } from './factories';
import { generate } from './helpers';

import { logger } from '~/utils';

const seederList = [{ model: UserSchema, factory: user }];

async function seed(seeder = null, max = 30) {
	await seeder.model.insertMany(generate(seeder.factory, max));
}

async function remove(seeder) {
	await seeder.model.deleteMany({});
	logger('info', 'Info:', `Deleted model.`);
}

function flushData() {
	let counter = 0;
	const { length } = seederList;
	while (counter < length) {
		seed(seederList[counter]);
		counter += 1;
	}
	logger('info', 'Info:', `Seeders Done.`);
}

async function run() {
	await Promise.all(seederList.map((seeder) => remove(seeder))).then(() => {
		flushData();
	});
}

run();
