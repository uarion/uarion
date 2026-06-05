import { describe, expect, it, beforeEach } from "vitest";
import { getHumanReviewQueue, resetHumanReviewQueue } from "./human-review-queue";
import { loadAuthenticityPolicy } from "../policy/loader";

describe("HumanReviewQueue", () => {
  beforeEach(() => resetHumanReviewQueue());

  it("enqueues dual reviewer for high fusion", () => {
    const q = getHumanReviewQueue();
    const policy = loadAuthenticityPolicy();
    const item = q.enqueue(0.9, policy);
    expect(item.requiresDual).toBe(true);
    expect(q.pendingCount()).toBe(1);
  });
});
