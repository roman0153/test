import assert from "node:assert/strict";
import { test } from "node:test";
import { isEmailAddress, isInquiryService, validateInquiry } from "../src/lib/contact-validation.ts";

const valid = {
  name: "Jana Nováková",
  email: "jana@example.test",
  phone: "+421 900 123 456",
  location: "Bratislava",
  service: "navrh",
  message: "Máme záujem o návrh novej rodinnej záhrady pri dome.",
  consent: true,
};

test("accepts a valid Slovak inquiry and trims text", () => {
  const result = validateInquiry({ ...valid, name: "  Jana Nováková  ", email: " jana@example.test " });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.name, valid.name);
    assert.equal(result.data.email, valid.email);
  }
});

test("optional phone and location can be omitted", () => {
  const result = validateInquiry({ ...valid, phone: undefined, location: undefined });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.phone, "");
});

for (const input of [null, undefined, [], "data", 42, {}]) {
  test(`rejects malformed inquiry: ${JSON.stringify(input)}`, () => {
    const result = validateInquiry(input);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors.name);
      assert.ok(result.errors.email);
      assert.ok(result.errors.message);
      assert.ok(result.errors.consent);
    }
  });
}

test("does not accept string consent or unknown service values", () => {
  const result = validateInquiry({ ...valid, consent: "true", service: "anything" });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.errors.consent);
    assert.ok(result.errors.service);
  }
});

test("enforces upper and lower text limits", () => {
  for (const message of [" ", "Short", "a".repeat(4001)]) {
    const result = validateInquiry({ ...valid, name: "a".repeat(101), location: "x".repeat(121), message });
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors.name);
      assert.ok(result.errors.location);
      assert.ok(result.errors.message);
    }
  }
  assert.equal(validateInquiry({ ...valid, message: "a".repeat(20) }).success, true);
  assert.equal(validateInquiry({ ...valid, message: "a".repeat(4000) }).success, true);
});

test("rejects invalid phones and wrong optional-field types", () => {
  for (const phone of ["abc", ".......", 123456789, "123\n456789"]) {
    const result = validateInquiry({ ...valid, phone });
    assert.equal(result.success, false);
    if (!result.success) assert.ok(result.errors.phone);
  }
  assert.equal(validateInquiry({ ...valid, location: { city: "Bratislava" } }).success, false);
});

test("rejects header injection and control characters", () => {
  assert.equal(validateInquiry({ ...valid, name: "Jana\r\nBcc: other@example.test" }).success, false);
  assert.equal(isEmailAddress("jana@example.test\nBcc: other@example.test"), false);
  assert.equal(isEmailAddress("ja\0na@example.test"), false);
  assert.equal(isEmailAddress("jane doe@example.test"), false);
  assert.equal(isEmailAddress("not-an-email"), false);
  assert.equal(isEmailAddress("jana+garden@example.test"), true);
});

test("service validation rejects inherited object properties", () => {
  assert.equal(isInquiryService("constructor"), false);
  assert.equal(isInquiryService("__proto__"), false);
  assert.equal(isInquiryService(["navrh"]), false);
  assert.equal(isInquiryService("navrh"), true);
});