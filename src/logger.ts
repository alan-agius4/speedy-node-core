import { cyan, red, yellow, green, gray, white } from "chalk";
import { padStart } from "lodash";

const padTimeUnit = (unit: number) => padStart(unit.toString(), 2, "0");

export class Logger {

	constructor(
		private scope?: string
	) {
	}

	info(message: string) {
		console.info(white(this.formatMessage(message)));
	}

	/**
	 * When `process.env.DEBUG` is not true debug message won't be printed.
	 *
	 * @param {string} method
	 * @param {string} message
	 * @returns
	 *
	 * @memberOf Logger
	 */
	debug(method: string, message: string) {
		if (!process.env.DEBUG) {
			return;
		}

		console.log(green(this.formatMessage(message, method)));
	}

	warn(message: string) {
		console.warn(yellow(this.formatMessage(message)));
	}

	error(message?: string, error?: Error) {
		console.error(red(this.formatMessage(this.formatErrorMessage(message, error))));
	}

	private formatMessage(message: string, method?: string): string {
		const date = new Date();
		const time = gray(`${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}:${padTimeUnit(date.getSeconds())}`);

		return `${white(`[${time}]`)} ${cyan(`${this.scope}:`)}${method ? ` ${method}` : ""} ${message}`;
	}

	private formatErrorMessage(message?: string, error?: Error): string {
		if (error) {
			const errorMsg = error.message ? error.message : JSON.stringify(error);
			return `Error: ${message ? `${message}, ${errorMsg}` : errorMsg}`;
		}

		return `Error: ${message}`;
	}

}