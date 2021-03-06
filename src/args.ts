import * as  _ from "lodash";

import { Dictionary } from "./dictionary";
import { string } from "./string";

export namespace args {

	const ARGS_REGEXP = /^(-+)([\w\-]*)(=?)([\w\-\s]*)$/;

	/**
	 * Merges `process.env.npm_config_argv` with `process.argv` and remove duplicate arguments
	 *
	 * @returns {string[]}
	 */
	export function mergedConfigArgsAndProcessArgv(): string[] {
		if (!process.env.npm_config_argv) {
			return process.argv.slice(2);
		}

		const parsedArgv = parse(process.argv);
		// todo: disable strictNullChecks until https://github.com/Microsoft/TypeScript/issues/16902 is solved
		const parsedConfigArgv = parse(JSON.parse(process.env.npm_config_argv!).cooked);
		const mergedArgv = { ...parsedArgv, ...parsedConfigArgv };
		const tranformedArgs = _.flatten<string>(_.get(parsedArgv, "_"));
		return [...tranformedArgs, ...toArray(mergedArgv)];
	}

	/**
	 * Converts dictonary/object to args, which is generally used for CLIs.
	 *
	 * `true` - will be converted to flag e.g. `--cached` (without value).
	 *
	 * `false` - will be omitted e.g. `""`.
	 *
	 * @example
	 * 	const params = {
	 *		"diff-filter": "ACM",
	 *		cached: false
	 *	};
	 * => ["--diff-filter", "ACM"]
	 *
	 * @param {Dictionary<any>} value dictionary/object to convert.
	 * @returns {string[]} converted parameter as args.
	 */
	export function toArray(value: Dictionary<any>): string[] {
		const argItems: string[] = [];

		_.forEach(value, (val, key) => {
			if (key === "_" || val === false) {
				return;
			}

			const tranformedKey = `--${key}`;

			if (_.isArray(val)) {
				argItems.push(tranformedKey, ..._.flatten(val).map(_.toString));
				return;
			} else if (val === true) {
				argItems.push(tranformedKey);
				return;
			}

			argItems.push(tranformedKey, _.toString(val));
		});

		return argItems;
	}

	/**
	 * Parse Argv and transform them to a Dictionary.
	 *
	 * @example
	 * const argv = ["--diff-filter", "ACM", "--cached"];
	 * 	=> {
	 *		"diff-filter": "ACM",
	 *		cached: true
	 *	};
	 *
	 * @param {string[]} argv
	 * @returns {Dictionary<any>}
	 */
	export function parse(argv: string[]): Dictionary<any> {
		const parsedArgv: Dictionary<any> = {
			_: []
		};

		let previousKey = "_";

		for (const keyOrValue of argv) {
			const castedValue = string.toPrimitive(keyOrValue);

			if (_.startsWith(keyOrValue, "-") && !_.isNumber(castedValue)) {
				const stringPartial = ARGS_REGEXP.exec(keyOrValue)!;

				previousKey = stringPartial[2];
				// by default set the value to true, since argv with no value are truthy
				const value = stringPartial[4];
				parsedArgv[previousKey] = value ? string.toPrimitive(value) : true;
				continue;
			}

			const currentValue = parsedArgv[previousKey];

			if (_.isBoolean(currentValue)) {
				// we have a value for the parameter, so we override it.
				parsedArgv[previousKey] = castedValue;
			} else if (_.isArray(currentValue)) {
				parsedArgv[previousKey] = [...currentValue, castedValue];
			} else {
				parsedArgv[previousKey] = [currentValue, castedValue];
			}
		}

		return parsedArgv;
	}

}
