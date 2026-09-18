type RateLimitOptions = { limit?: number; windowMs?: number; maxEntries?: number; now?: () => number };
type Bucket = { count: number; expires: number };

// Best-effort, per-process protection. Use an upstream shared limiter for multi-instance hosting.
export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxEntries: number;
  private readonly now: () => number;

  constructor({ limit = 5, windowMs = 15 * 60 * 1000, maxEntries = 10_000, now = Date.now }: RateLimitOptions = {}) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxEntries = maxEntries;
    this.now = now;
  }

  consume(key: string): { allowed: boolean; retryAfter: number } {
    const now = this.now();
    for (const [entry, bucket] of this.buckets) {
      if (bucket.expires <= now) this.buckets.delete(entry);
    }

    const existing = this.buckets.get(key);
    if (existing) {
      const retryAfter = Math.max(1, Math.ceil((existing.expires - now) / 1000));
      if (existing.count >= this.limit) return { allowed: false, retryAfter };
      existing.count += 1;
      return { allowed: true, retryAfter: 0 };
    }
    if (this.buckets.size >= this.maxEntries) return { allowed: false, retryAfter: 60 };
    this.buckets.set(key, { count: 1, expires: now + this.windowMs });
    return { allowed: true, retryAfter: 0 };
  }
}