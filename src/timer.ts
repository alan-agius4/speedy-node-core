import { Logger } from "./logger";

export class Timer {
	private logger: Logger;
	private startTime: number;

	/**
	 * Creates an instance of a Timer.
	 *
	 * @example
	 * const logger = new Logger("lint");
	 * const timer = new Timer(logger);
	 * timer.start();
	 * timer.finish();
	 *
	 * const timer = new Timer(null, "lint");
	 * timer.start();
	 * timer.finish();
	 *
	 * @param {Logger} [loggerInstance] An existing instance of a logger.
	 * @param {string} [scope] A scope to create the logger instance with, if a logger instance is not provide.
	 *
	 * @memberOf Timer
	 */
	constructor(
		loggerInstance?: Logger,
		scope?: string
	) {
		if (!loggerInstance) {
			this.logger = new Logger(scope);
		} else {
			this.logger = loggerInstance;
		}
	}

	start() {
		this.startTime = Date.now();
		this.logger.info("Started...");
	}

	finish() {
		const duration = Date.now() - this.startTime;
		const time = duration > 1000
			? `${(duration / 1000).toFixed(2).replace(".00", "")} s`
			: `${duration.toFixed(0)} ms`;

		this.logger.info(`Finished in ${time}`);
	}

}