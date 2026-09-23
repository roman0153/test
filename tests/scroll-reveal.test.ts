import assert from "node:assert/strict";
import { test } from "node:test";
import { cssTimeToMilliseconds, revealKeyframes } from "../src/lib/scroll-reveal.ts";

test("preserves CSS millisecond durations and stagger delays", () => {
  for (const milliseconds of [60, 90, 100, 120, 180, 200, 270, 300, 640, 750, 760, 900, 950, 1200]) {
    assert.equal(cssTimeToMilliseconds(`${milliseconds}ms`, 1), milliseconds);
  }
});

test("converts production-minified seconds to Web Animations milliseconds", () => {
  for (const [value, milliseconds] of [
    [".76s", 760],
    [".9s", 900],
    [".64s", 640],
    [".09s", 90],
    [".18s", 180],
    [".27s", 270],
    [".95s", 950],
    ["1.2s", 1200],
    ["1.5s", 1500],
  ] as const) {
    assert.equal(cssTimeToMilliseconds(value, 1), milliseconds);
  }
});

test("accepts surrounding whitespace and case-insensitive CSS time units", () => {
  assert.equal(cssTimeToMilliseconds("  .76s\n", 1), 760);
  assert.equal(cssTimeToMilliseconds("+900MS", 1), 900);
  assert.equal(cssTimeToMilliseconds("0.9S", 1), 900);
  assert.equal(cssTimeToMilliseconds("12.5ms", 1), 12.5);
});

test("preserves an intentional zero instead of replacing it with the fallback", () => {
  for (const value of ["0", "0ms", "0s", ".0s"]) {
    assert.equal(cssTimeToMilliseconds(value, 760), 0);
  }
});

test("uses the fallback for missing, malformed or negative reveal timings", () => {
  for (const value of ["", " ", "auto", "760", "760px", ".76s extra", "NaNms", "Infinitys", "-1s", "-90ms"]) {
    assert.equal(cssTimeToMilliseconds(value, 760), 760);
    assert.equal(cssTimeToMilliseconds(value, 0), 0);
  }
});

test("rejects CSS time values that overflow a finite animation duration", () => {
  assert.equal(cssTimeToMilliseconds(`${"9".repeat(400)}s`, 760), 760);
});

test("text and card reveals lift without clipping content", () => {
  const expected = [
    { opacity: 0, transform: "translate3d(0, 36px, 0) scale(1)" },
    { opacity: 1, transform: "none" },
  ];
  for (const kind of ["up", "unknown", undefined]) {
    assert.deepEqual(revealKeyframes(kind, "36px", "1"), expected);
  }
});

test("image reveals open the mask and finish fully visible without transforms", () => {
  assert.deepEqual(revealKeyframes("image", "24px", "1.025"), [
    { opacity: 0.2, transform: "translate3d(0, 24px, 0) scale(1.025)", clipPath: "inset(0 0 12% 0)" },
    { opacity: 1, transform: "none", clipPath: "inset(0 0 0% 0)" },
  ]);
});

test("mobile reveal parameters do not mutate another animation's keyframes", () => {
  const first = revealKeyframes("image", "14px", "1.015");
  first[0].opacity = 0.5;
  const second = revealKeyframes("image", "14px", "1.015");
  assert.equal(second[0].opacity, 0.2);
  assert.equal(second[0].transform, "translate3d(0, 14px, 0) scale(1.015)");
});