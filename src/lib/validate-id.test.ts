import { describe, expect, it } from "vitest";
import { isValidUuid } from "./validate-id";

describe("isValidUuid", () => {
  it("accepts valid uuid", () => {
    expect(isValidUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects garbage", () => {
    expect(isValidUuid("not-a-uuid")).toBe(false);
    expect(isValidUuid("'; DROP TABLE--")).toBe(false);
  });
});
