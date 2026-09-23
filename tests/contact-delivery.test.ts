import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { deliverInquiry, DeliveryError, getContactMode } from "../src/lib/contact-delivery.ts";
import type { Inquiry } from "../src/lib/contact-validation.ts";

const inquiry: Inquiry = { name: "Jana Nováková", email: "jana@example.test", phone: "", location: "Bratislava", service: "navrh", message: "Máme záujem o návrh novej rodinnej záhrady.\nĎakujeme.", consent: true };
const configured = { NODE_ENV: "production", RESEND_API_KEY: "test-key-not-a-secret", CONTACT_FROM_EMAIL: "web@example.test", CONTACT_TO_EMAIL: "studio@example.test" };

test("local capture is available only in explicit development mode", () => {
  assert.equal(getContactMode({ NODE_ENV: "development" }), "local");
  assert.equal(getContactMode({ NODE_ENV: "production" }), "unconfigured");
  assert.equal(getContactMode({}), "unconfigured");
  assert.equal(getContactMode(configured), "email");
});

test("partial or malformed configuration cannot silently fall back to local capture", () => {
  assert.equal(getContactMode({ NODE_ENV: "development", RESEND_API_KEY: "test-key" }), "unconfigured");
  assert.equal(getContactMode({ ...configured, CONTACT_FROM_EMAIL: "invalid" }), "unconfigured");
});

test("stores distinct local submissions as private NDJSON records", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "eden-contact-test-"));
  try {
    const options = { environment: { NODE_ENV: "development" }, storageDirectory: directory };
    const first = await deliverInquiry(inquiry, options);
    const second = await deliverInquiry(inquiry, options);
    assert.equal(first.delivery, "local");
    assert.notEqual(first.id, second.id);
    const filename = path.join(directory, "contact-submissions.ndjson");
    const records = (await readFile(filename, "utf8")).trim().split("\n").map((line) => JSON.parse(line));
    assert.equal(records.length, 2);
    assert.equal(records[0].message, inquiry.message);
    assert.equal(records[0].id, first.id);
    assert.ok(records[0].createdAt);
    if (process.platform !== "win32") assert.equal((await stat(filename)).mode & 0o777, 0o600);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("sends plain-text email with a configured sender and visitor reply-to", async () => {
  let body: Record<string, unknown> | undefined;
  const receipt = await deliverInquiry(inquiry, {
    environment: configured,
    fetcher: async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(options?.method, "POST");
      assert.ok(options?.signal);
      body = JSON.parse(String(options?.body));
      return Response.json({ id: "provider-reference" });
    },
  });
  assert.equal(receipt.delivery, "email");
  assert.equal(body?.from, configured.CONTACT_FROM_EMAIL);
  assert.equal(body?.reply_to, inquiry.email);
  assert.ok(!body?.html);
  assert.ok(String(body?.text).includes(inquiry.message));
});

test("provider rejection, network failure and invalid receipts are not successful delivery", async () => {
  for (const fetcher of [
    async () => Response.json({ error: "unavailable" }, { status: 503 }),
    async () => { throw new Error("network unavailable"); },
    async () => Response.json({}),
    async () => new Response("invalid JSON"),
  ]) {
    await assert.rejects(deliverInquiry(inquiry, { environment: configured, fetcher }), (error: unknown) => error instanceof DeliveryError && error.kind === "provider");
  }
});

test("unconfigured production does not call an external service", async () => {
  let called = false;
  await assert.rejects(deliverInquiry(inquiry, { environment: { NODE_ENV: "production" }, fetcher: async () => { called = true; return Response.json({ id: "bad" }); } }), DeliveryError);
  assert.equal(called, false);
});