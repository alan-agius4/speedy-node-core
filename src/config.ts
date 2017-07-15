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
	export function getConfigFilePath(file: string, defaultLocation: string): string {
		if (isAbsolute(file)) {
			return file;
		}

		const path = join(fileSystem.getRootPath(), file);

		if (existsSync(path)) {
			return path;
		}

		return join(defaultLocation, file);
	}

	/**
	 * @deprecated use `@speedy/json-extends` instead.
	 * Retrieve a JSON file. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath
	 * @returns {Promise<T>}
	 */
	export async function readConfigFile<T>(filePath: string): Promise<T> {
		let configData = await fileSystem.readJsonFileAsync<T & { extends?: string | string[] }>(filePath);

		if (_.isEmpty(configData.extends)) {
			return configData;
		}

		const configExtends = _.castArray<string>(configData.extends);

		for (const path of configExtends) {
			configData = _.merge({}, await readConfigFile(path), configData);
		}

		return configData;
	}
}