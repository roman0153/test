import assert from "node:assert/strict";
import { test } from "node:test";
import { createContactHandler } from "../src/lib/contact-handler.ts";
import { DeliveryError } from "../src/lib/contact-delivery.ts";
import { RateLimiter } from "../src/lib/rate-limit.ts";
import type { Inquiry } from "../src/lib/contact-validation.ts";

const inquiry = { name: "Jana Nováková", email: "jana@example.test", phone: "", location: "", service: "navrh", message: "Máme záujem o návrh novej rodinnej záhrady.", consent: true, website: "" };
const origin = "http://localhost:3000";

function request(body: unknown = inquiry, headers: Record<string, string> = {}) {
  return new Request(`${origin}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, ...headers }, body: JSON.stringify(body) });
}

test("accepts validated data and accurately reports local delivery", async () => {
  let received: Inquiry | undefined;
  const handle = createContactHandler({ deliver: async (data) => { received = data; return { id: "local-reference", delivery: "local" }; } });
  const response = await handle(request());
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.delivery, "local");
  assert.match(body.message, /E-mail nebol odoslaný/);
  assert.equal(received?.name, inquiry.name);
  assert.ok(!Object.hasOwn(received || {}, "website"));
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("confirms an email only after the delivery function succeeds", async () => {
  const handle = createContactHandler({ deliver: async () => ({ id: "email-reference", delivery: "email" }) });
  const response = await handle(request());
  assert.equal(response.status, 201);
  assert.equal((await response.json()).delivery, "email");
});

test("returns field errors and never delivers invalid data", async () => {
  let delivered = false;
  const handle = createContactHandler({ deliver: async () => { delivered = true; return { id: "unexpected", delivery: "email" }; } });
  const response = await handle(request({ ...inquiry, email: "invalid", consent: false }));
  assert.equal(response.status, 422);
  const body = await response.json();
  assert.ok(body.errors.email);
  assert.ok(body.errors.consent);
  assert.equal(delivered, false);
});

test("rejects cross-origin submissions and respects the configured origin", async () => {
  const handle = createContactHandler({ siteUrl: "https://garden.example.test" });
  assert.equal((await handle(request())).status, 403);
  assert.equal((await createContactHandler()(request(inquiry, { Origin: "https://untrusted.example.test" }))).status, 403);
  const noOrigin = new Request(`${origin}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json", "Sec-Fetch-Site": "cross-site" }, body: JSON.stringify(inquiry) });
  assert.equal((await createContactHandler()(noOrigin)).status, 403);
});

test("rejects unexpected methods and content types", async () => {
  const handle = createContactHandler();
  const response = await handle(new Request(`${origin}/api/contact`));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
  assert.equal((await handle(request(inquiry, { "Content-Type": "text/plain" }))).status, 415);
});

test("handles malformed JSON without throwing", async () => {
  const response = await createContactHandler()(new Request(`${origin}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{broken" }));
  assert.equal(response.status, 400);
});

test("bounds the actual body even without a Content-Length header", async () => {
  const response = await createContactHandler()(request({ ...inquiry, message: "x".repeat(13 * 1024) }));
  assert.equal(response.status, 413);
  assert.equal((await createContactHandler()(request(inquiry, { "Content-Length": "999999" }))).status, 413);
});

test("rejects honeypot submissions", async () => {
  assert.equal((await createContactHandler()(request({ ...inquiry, website: "spam.example.test" }))).status, 400);
});

test("returns a retry header when the rate limit is reached", async () => {
  const handle = createContactHandler({ limiter: new RateLimiter({ limit: 1 }), deliver: async () => ({ id: "id", delivery: "local" }) });
  assert.equal((await handle(request())).status, 201);
  const response = await handle(request());
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
});

test("never returns false success for configuration or provider failures", async () => {
  for (const kind of ["configuration", "provider", "storage"] as const) {
    const handle = createContactHandler({ deliver: async () => { throw new DeliveryError(kind); } });
    const response = await handle(request());
    assert.equal(response.status, 503);
    assert.ok(!(await response.json()).id);
  }
});