import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import nextConfig from "../next.config.ts";
import { articles, images, navigation, projectCategories, projects, services } from "../src/lib/content.ts";
import { isInquiryService } from "../src/lib/contact-validation.ts";

test("all navigation destinations have an implemented page", () => {
  for (const item of navigation) {
    assert.ok(existsSync(new URL(`../src/app${item.href}/page.tsx`, import.meta.url)), item.href);
  }
});

test("all projects have unique valid routes, supported filters and gallery content", () => {
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(projectCategories.includes(project.category));
    assert.ok(project.gallery.length >= 2);
    assert.ok(project.imageAlt.length > 10);
    for (const image of project.gallery) assert.ok(image.alt.length > 10);
  }
});

test("all photos use direct Pinterest originals, not pin pages or share links", () => {
  const sources = [
    ...Object.values(images),
    ...services.map((service) => service.image),
    ...articles.map((article) => article.image),
    ...projects.flatMap((project) => [project.image, ...project.gallery.map((image) => image.src)]),
  ];
  for (const source of sources) {
    const url = new URL(source);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "i.pinimg.com");
    assert.equal(url.port, "");
    assert.equal(url.search, "");
    assert.equal(url.hash, "");
    assert.match(url.pathname, /^\/originals\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{32}\.jpg$/);
  }
  assert.equal(new Set(Object.values(images)).size, 7);
});

test("Next.js permits only the selected Pinterest original image host and path", () => {
  assert.deepEqual(nextConfig.images?.remotePatterns, [
    { protocol: "https", hostname: "i.pinimg.com", port: "", pathname: "/originals/**", search: "" },
  ]);
});

test("every service can be preselected in the contact form", () => {
  assert.equal(services.length, 4);
  assert.equal(new Set(services.map((service) => service.id)).size, 4);
  for (const service of services) assert.ok(isInquiryService(service.id));
});

test("journal routes and dates are valid and articles have complete content", () => {
  assert.equal(new Set(articles.map((article) => article.slug)).size, articles.length);
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!Number.isNaN(Date.parse(article.date)));
    assert.ok(article.sections.length >= 3);
    for (const section of article.sections) assert.ok(section.text.length > 100);
  }
});