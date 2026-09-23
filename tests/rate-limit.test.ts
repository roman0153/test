import assert from "node:assert/strict";
import { test } from "node:test";
import { RateLimiter } from "../src/lib/rate-limit.ts";

test("allows the limit and rejects additional submissions", () => {
  const limiter = new RateLimiter({ limit: 2, windowMs: 10_000, now: () => 1000 });
  assert.equal(limiter.consume("visitor").allowed, true);
  assert.equal(limiter.consume("visitor").allowed, true);
  assert.deepEqual(limiter.consume("visitor"), { allowed: false, retryAfter: 10 });
});

test("visitor buckets are separate and expire", () => {
  let now = 0;
  const limiter = new RateLimiter({ limit: 1, windowMs: 1000, now: () => now });
  assert.equal(limiter.consume("a").allowed, true);
  assert.equal(limiter.consume("a").allowed, false);
  assert.equal(limiter.consume("b").allowed, true);
  now = 1000;
  assert.equal(limiter.consume("a").allowed, true);
});

test("bounds memory without evicting active visitors to bypass limits", () => {
  let now = 0;
  const limiter = new RateLimiter({ limit: 1, maxEntries: 2, windowMs: 1000, now: () => now });
  assert.equal(limiter.consume("a").allowed, true);
  assert.equal(limiter.consume("b").allowed, true);
  assert.equal(limiter.consume("c").allowed, false);
  assert.equal(limiter.consume("a").allowed, false);
  now = 1001;
  assert.equal(limiter.consume("c").allowed, true);
});