import * as _ from "lodash";
import * as rimraf from "rimraf";
import { sync } from "fast-glob";
import { readFile, statSync } from "fs";
import * as FS_CONSTANTS from "constants";
import { join, sep, normalize, resolve } from "path";

export namespace fileSystem {

	export const getRootPath = _.memoize(() => findFileRecursively() || "");

	export function deleteAsync(path: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			rimraf(path, error => {
				if (error) {
					return reject(error);
				}

				return resolve(true);
			});
		});
	}

	export function readFileAsync(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			readFile(path, "utf-8", (error, data) => {
				if (error) {
					return reject(error);
				}

				return resolve(data);
			});
		});
	}

	export async function readJsonFileAsync<T>(path: string): Promise<T> {
		return JSON.parse(await readFileAsync(path));
	}

	export function glob(source: string | string[]): string[] {
		try {
			// empty bashNative is required to fix the below issue on MAC OSX
			// https://github.com/jonschlinkert/bash-glob/issues/2#issuecomment-285879264
			return sync(source, { bashNative: [] });
		} catch (error) {
			if (error.errno === -FS_CONSTANTS.ENOENT) {
				return [];
			}

			throw error;
		}
	}

	/**
	 * Find a file recursively in the file system from the starting path upwards.
	 *
	 * Defaults: fileName: package.json, startPath: process.cwd()
	 *
	 * @param {string} [fileName="package.json"]
	 * @param {string} [startPath=process.cwd()]
	 * @returns {(string | undefined)}
	 */
	export function findFileRecursively(fileName = "package.json", startPath = process.cwd()): string | undefined {
		startPath = normalize(startPath);

		try {
			const directory = join(startPath, sep);
			statSync(join(directory, fileName));
			return directory;
		} catch (error) {
			// do nothing
		}

		let position = _.lastIndexOf(startPath, sep);
		if (position < 0) {
			return undefined;
		}

		const truncatedPath = startPath.substr(0, position++);
		return findFileRecursively(fileName, truncatedPath);
	}

	/**
	 * Get a canonicalized absolute path
	 *
	 * @export
	 * @param {string} path
	 * @returns {string} canonicalized absolute path
	 */
	export function getCanonicalPath(path: string): string {
		return resolve(process.cwd(), path);
	}

}
