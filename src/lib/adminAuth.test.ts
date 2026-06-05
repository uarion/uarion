import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isAdminEmail } from "./adminAuth";

describe("isAdminEmail", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_EMAIL", "admin@uarion.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("matches configured admin email (case insensitive)", () => {
    expect(isAdminEmail("admin@uarion.test")).toBe(true);
    expect(isAdminEmail("Admin@UARION.test")).toBe(true);
  });

  it("rejects other emails", () => {
    expect(isAdminEmail("user@example.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });
});
