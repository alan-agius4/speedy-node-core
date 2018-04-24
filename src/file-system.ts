import { copy } from "cpx";
import * as _ from "lodash";
import * as rimraf from "rimraf";
import { sync } from "glob";
import { readFile, statSync } from "fs";
import { join, sep, normalize, resolve } from "path";

export namespace fileSystem {

	export const getRootPath = _.once(() => findFileRecursively() || "");

	export function deleteAsync(path: string): Promise<boolean> {
		// tslint:disable-next-line:no-shadowed-variable
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
		// tslint:disable-next-line:no-shadowed-variable
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

	export function glob(patterns: string | string[]): string[] {
		const paths = _.castArray(patterns);

		const ignoredPatterns = _.chain(paths)
			.filter(x => _.startsWith(x, "!"))
			.map(x => _.trimStart(x, "!"))
			.value();

		return _.chain(paths)
			.filter(x => !_.startsWith(x, "!"))
			.flatMap(x => sync(x, { ignore: ignoredPatterns }))
			.value();
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

	/**
	 * Copy an array of file globs
	 * @param source The glob of target files
	 * @param destination The path of a destination directory
	 */
	export function copyAsync(source: string | string[], destination: string): Promise<void[]> {
		return Promise.all(
			_.chain(source)
				.castArray()
				.map(x =>
					new Promise<void>((resolve, reject) => {
						copy(x, destination, (error: Error | null) => error ? reject(error) : resolve());
					}))
				.value()
		);
	}

}
