import * as mockFs from "mock-fs";

import { json } from "./json";

describe("jsonSpec", () => {
	describe(json.read.name, () => {
		const MAIN_FILE = {
			extends: [
				"./config/primary-extend.json"
			],
			rules: {
				message: {
					maxLength: 100,
					minLength: 2
				}
			}
		};

		const MAIN_FILE_WITH_ALIAS = {
			extends: [
				"primary-extend"
			],
			rules: {
				message: {
					maxLength: 100,
					minLength: 2
				}
			}
		};

		const PRIMARY_EXTEND_FILE = {
			extends: "./config/secondary-extend.json",
			rules: {
				message: {
					minLength: 1,
					noDashes: true
				}
			}
		};

		const SECONDARY_EXTEND_FILE = {
			rules: {
				message: {
					minLength: 4,
					noWhiteSpace: true
				}
			}
		};

		beforeEach(() => {
			mockFs({
				"speedy-commit-msg-hook.json": JSON.stringify(MAIN_FILE),
				"speedy-commit-msg-hook-alias.json": JSON.stringify(MAIN_FILE_WITH_ALIAS),
				config: {
					"primary-extend.json": JSON.stringify(PRIMARY_EXTEND_FILE),
					"secondary-extend.json": JSON.stringify(SECONDARY_EXTEND_FILE)
				}
			});
		});

		afterEach(() => {
			mockFs.restore();
		});


		it("should merge object of extended config with alias", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook-alias.json", {
				"primary-extend": "./config/primary-extend.json"
			});
			expect(result.rules.message.maxLength).toBe(100);
			expect(result.rules.message.noDashes).toBe(true);
			done();
		});

		it("should merge object of extended config", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.maxLength).toBe(100);
			expect(result.rules.message.noDashes).toBe(true);
			done();
		});

		it("should override same properties", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.minLength).toBe(2);
			done();
		});

		it("should merge properties of nested extended config", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.noDashes).toBe(true);
			expect(result.rules.message.minLength).toBe(2);
			expect(result.rules.message.noWhiteSpace).toBe(true);
			done();
		});
	});
});