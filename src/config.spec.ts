import * as mockFs from "mock-fs";

import { config } from "./config";

describe("fileSystemSpec", () => {
	describe(config.readConfigFile.name, () => {
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
				config: {
					"primary-extend.json": JSON.stringify(PRIMARY_EXTEND_FILE),
					"secondary-extend.json": JSON.stringify(SECONDARY_EXTEND_FILE)
				}
			});
		});

		afterEach(() => {
			mockFs.restore();
		});

		it("should merge object of extended config", async done => {
			const result = await config.readConfigFile<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.maxLength).toBe(100);
			expect(result.rules.message.noDashes).toBe(true);
			done();
		});

		it("should override same properties", async done => {
			const result = await config.readConfigFile<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.minLength).toBe(2);
			done();
		});

		it("should merge properties of nested extended config", async done => {
			const result = await config.readConfigFile<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.noDashes).toBe(true);
			expect(result.rules.message.minLength).toBe(2);
			expect(result.rules.message.noWhiteSpace).toBe(true);
			done();
		});
	});
});