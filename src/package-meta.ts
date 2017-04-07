import { readFileSync } from "fs";

export namespace packageMeta {

	/**
	 * Get the version number from a `package.json`
	 *
	 * @param {string} [packagePath="./package.json"]
	 * @returns {string}
	 */
	export function getVersion(packagePath = "./package.json"): string {
		return JSON.parse(readFileSync(packagePath, "utf-8")).version || "";
	}

}