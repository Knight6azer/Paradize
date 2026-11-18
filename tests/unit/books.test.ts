import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getHighResCover } from "../../src/lib/books/google-books.ts";

describe("Book Services — Unit Tests", () => {
  describe("getHighResCover", () => {
    it("should upgrade Google Books thumbnail URL to zoom=2 and HTTPS", () => {
      const input = "http://books.google.com/books/content?id=xyz&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
      const result = getHighResCover(input);
      assert.ok(result);
      assert.ok(result?.startsWith("https://"));
      assert.ok(result?.includes("zoom=2"));
      assert.ok(!result?.includes("&edge=curl"));
    });

    it("should return null when input cover is null or undefined", () => {
      assert.equal(getHighResCover(null), null);
    });
  });
});
