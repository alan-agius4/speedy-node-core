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

}