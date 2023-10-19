/* eslint-disable no-console */
import chalk from "chalk";
import moment from "moment";

interface ILogger {
  log(message: string): void;
}

class Logger implements ILogger {
  log(message: string) {
    console.log(message);
  }
}

class ChalkLogger implements ILogger {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly color: typeof chalk | any,
    private readonly prefix: string,
  ) {}

  log(message: undefined | unknown | string | object) {
    console.log(this.color.bold(this.prefix), message);
  }
}

const infoLogger = new ChalkLogger(chalk.blue, `${moment.utc()} INFO:`);
const warnLogger = new ChalkLogger(chalk.yellow, `${moment.utc()} WARN:`);
const errorLogger = new ChalkLogger(chalk.red, `${moment.utc()} ERROR:`);
const successLogger = new ChalkLogger(chalk.green, `${moment.utc()} SUCCESS:`);

export {
  Logger,
  ChalkLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  successLogger,
};
