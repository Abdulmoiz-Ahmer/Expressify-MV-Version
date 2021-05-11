import chalk from 'chalk';
import { types } from '~/constants';

const { log } = console;

// types are one of loggerTypes
// identifier is a sort of unique message you want to identify your log from
// message is an error, warning, info success message

export const logger = (type, identifier, message) => {
  const { Success, Error, Info, Warning } = types;

  switch (type) {
    case Error:
      log(
        chalk.bgWhite.hex('#E74C3C').bold(identifier),
        chalk.hex('#E74C3C').bold(message),
      );
      break;
    case Info:
      log(
        chalk.bgWhite.hex('#3498DB').bold(identifier),
        chalk.hex('#3498DB').bold(message),
      );
      break;
    case Warning:
      log(
        chalk.bgWhite.hex('#F1C40F').bold(identifier),
        chalk.hex('#F1C40F').bold(message),
      );
      break;
    case Success:
      log(
        chalk.bgWhite.hex('#1ABC9C').bold(identifier),
        chalk.hex('#1ABC9C').bold(message),
      );
      break;
    default:
      throw new Error('Invalid Logger Type');
  }
};
