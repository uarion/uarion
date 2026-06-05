import type { HumanReviewDecision } from "../types";
import type { AuthenticityPolicy } from "../policy/types";

export type QueueItem = {
  id: string;
  fusionScore: number;
  requiresDual: boolean;
  reviewersAssigned: number;
  decision: HumanReviewDecision;
  status: "pending" | "escalated" | "resolved";
};

let queueCounter = 0;

/** In-memory mock human review queue (Lab simulation) */
export class HumanReviewQueue {
  private items: QueueItem[] = [];

  enqueue(fusionScore: number, policy: AuthenticityPolicy): QueueItem {
    const requiresDual = fusionScore >= policy.review_rules.require_dual_reviewer_above;
    const item: QueueItem = {
      id: `hrq_${++queueCounter}`,
      fusionScore,
      requiresDual,
      reviewersAssigned: requiresDual ? 2 : 1,
      decision: "pending",
      status: "pending",
    };
    this.items.push(item);
    return item;
  }

  resolve(id: string, decision: HumanReviewDecision): QueueItem | null {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;
    item.decision = decision;
    item.status = decision === "escalate_mock" ? "escalated" : "resolved";
    return item;
  }

  list(): QueueItem[] {
    return [...this.items];
  }

  pendingCount(): number {
    return this.items.filter((i) => i.status === "pending").length;
  }
}

let globalQueue: HumanReviewQueue | null = null;

export function getHumanReviewQueue(): HumanReviewQueue {
  if (!globalQueue) globalQueue = new HumanReviewQueue();
  return globalQueue;
}

export function resetHumanReviewQueue(): void {
  globalQueue = null;
}
