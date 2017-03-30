import * as _ from "lodash";
import { existsSync } from "fs";
import { join, isAbsolute } from "path";

import { fileSystem } from "./file-system";

export namespace config {

	/**
	 * Try to locate a file in the root path of the project.
	 *
	 * @param {string} file
	 * @param {string} defaultPath
	 * @returns {string}
	 */
	export function getConfigFilePath(file: string, defaultPath: string): string {
		if (isAbsolute(file)) {
			return file;
		}

		const path = join(fileSystem.getRootPath(), file);

		if (existsSync(path)) {
			return path;
		}

		return defaultPath;
	}

	/**
	 * Retrieve a JSON file. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath
	 * @returns {Promise<T>}
	 */
	export async function readConfigFile<T>(filePath: string): Promise<T> {
		let config = await fileSystem.readJsonFileAsync<T & { extends?: string | string[] }>(filePath);

		if (_.isEmpty(config.extends)) {
			return config;
		}

		const configExtends = _.castArray<string>(config.extends);

		for (const path of configExtends) {
			config = _.merge({}, await readConfigFile(path), config);
		}

		return config;
	}

}