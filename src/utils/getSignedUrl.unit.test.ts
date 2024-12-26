import { describe, expect, it } from "vitest";
import { getSignedUrl } from "./getSignedUrl";

describe("getSignedUrl unit tests", () => {
	it("returns a signed url", async () => {
		const fileName = Math.random().toString();
		const signedUrl = await getSignedUrl(fileName);
		expect(() => new URL(signedUrl)).not.toThrowError();
	});
});
