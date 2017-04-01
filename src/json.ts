import * as _ from "lodash";
import * as fs from "fs";

export namespace json {

	/**
	 * Retrieve a JSON file. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath path to a JSON file.
	 * @param {{ [id: string]: string }} [extendsMap] A key value pair of maps for JSON files.
	 *
	 * @example
	 * import { json } from "@speedy/json-extends";
	 *
	 * const maps = {
	 * 	"@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
	 * };
	 *
	 * json.read("local-config.json", maps)
	 * 	.then(content => {
	 * 		// json content
	 * 	});
	 *
	 * @returns {Promise<T>}
	 */
	export async function read<T>(filePath: string, extendsMap?: { [id: string]: string }): Promise<T> {
		let content = JSON.parse(fs.readFileSync(filePath, "utf-8")) as T & { extends?: string | string[] };

		if (_.isEmpty(content.extends)) {
			return content;
		}

		const configExtends = _.castArray<string>(content.extends);

		for (let path of configExtends) {
			if (extendsMap) {
				const extendsKey = extendsMap[path];

				if (extendsKey) {
					path = extendsKey;
				}
				console.log(path);
			}

			content = _.merge({}, await read(path, extendsMap), content);
		}

		return content;
	}

}