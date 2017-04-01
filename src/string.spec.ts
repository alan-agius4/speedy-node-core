import { string } from "./string";

describe("stringSpec", () => {
	describe(string.toPrimitive.name, () => {
		it("should cast string '10' to type number", () => {
			expect(string.toPrimitive("10")).toBe(10);
		});

		it("should return value when value is a string", () => {
			expect(string.toPrimitive("hello")).toBe("hello");
		});

		it("should cast string 'true' to type boolean", () => {
			expect(string.toPrimitive("true")).toBe(true);
		});

		it("should cast string 'false' to type boolean", () => {
			expect(string.toPrimitive("false")).toBe(false);
		});
	});
});