import { args } from "./args";

describe("argsSpec", () => {
	describe(args.mergedConfigArgsAndProcessArgv.name, () => {
		const processArgs = process.argv;
		const npmConfigArgv = process.env.npm_config_argv;

		beforeAll(() => {
			process.env.npm_config_argv = JSON.stringify({
				cooked: [
					"run",
					"clean",
					"--config",
					"config.txt",
					"--files",
					"file-1.txt",
					"file-2.txt"
				]
			});

			process.argv = [
				"C:\\Program Files\\nodejs\\node.exe",
				"C:\\git\\node_modules\tasks.js",
				"clean",
				"--config",
				"config-override.txt",
				"--debug"
			];
		});

		afterAll(() => {
			process.argv = processArgs;
			process.env.npm_config_argv = npmConfigArgv;
		});

		it("should merge and override process.env.npm_config_argv with process.args values", () => {
			const argv = args.parse(args.mergedConfigArgsAndProcessArgv());
			expect(argv.config).toBe("config.txt");
			expect(argv.debug).toBe(true);
		});

		it("should return 'files' argument as array", () => {
			const argv = args.parse(args.mergedConfigArgsAndProcessArgv());
			expect(argv.files).toEqual([
				"file-1.txt",
				"file-2.txt"
			]);
		});
	});

	describe(args.parse.name, () => {
		it("should parse 'Args' and convert them to a dictionary", () => {
			const parsedArgs = args.parse(["--debug", "--config", "config-1.txt", "config-2.txt", "--help", "false"]);
			expect(parsedArgs.help).toBe(false);
			expect(parsedArgs.debug).toBe(true);
			expect(parsedArgs.config).toEqual(["config-1.txt", "config-2.txt"]);
		});

		it("should parse args with equals as key/value pair", () => {
			const parsedArgs = args.parse(["--debug=true", "--help=false"]);
			expect(parsedArgs.help).toBe(false);
			expect(parsedArgs.debug).toBe(true);
		});
	});

	describe(args.toArray.name, () => {
		it("should be converted", () => {
			const result = args.toArray({
				"diff-filter": "ACM",
				cached: true
			});
			expect(result).toEqual(["--diff-filter", "ACM", "--cached"]);
		});

		describe("given false boolean", () => {
			it("should be omitted", () => {
				const result = args.toArray({
					"diff-filter": "ACM",
					cached: false
				});

				expect(result).toEqual(["--diff-filter", "ACM"]);
			});
		});
	});
});