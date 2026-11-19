import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadLessonDirectory } from "./lessons";
import { PILLAR_IDS } from "./pillars";

test("lesson files are valid and each pillar has at least three", () => {
  const { errors, published } = loadLessonDirectory();
  assert.equal(errors.length, 0, errors.join("\n"));
  assert.ok(published.length >= 9, `expected at least 9 lessons, found ${published.length}`);
  for (const pillar of PILLAR_IDS) {
    const count = published.filter((lesson) => lesson.pillar === pillar).length;
    assert.ok(count >= 3, `${pillar} has ${count}`);
  }
  for (const lesson of published) {
    const kinds = lesson.blocks.map((block) => block.kind);
    assert.ok(kinds.includes("goals"));
    assert.ok(kinds.includes("practice"));
    assert.ok(kinds.includes("recap"));
    assert.ok(kinds.includes("reflection"));
    assert.ok(kinds.filter((kind) => kind === "section").length >= 2);
  }
  console.log(`Published lessons: ${published.length}.`);
});

test("the readme contains the lesson template", () => {
  const template = fs
    .readFileSync(path.join(process.cwd(), "content", "lessons", "_template.md"), "utf8")
    .trim();
  const readme = fs.readFileSync(path.join(process.cwd(), "README.md"), "utf8");
  assert.match(readme, /How to add or edit a lesson/);
  assert.ok(readme.includes(template));
});

test("the only helpline number is SADAG", () => {
  const allowed = new Set(["0800 567 567", "0800567567"]);
  const found: string[] = [];
  const walk = (entry: string) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      if (entry.endsWith("node_modules") || entry.endsWith(".next") || entry.endsWith("out")) return;
      for (const child of fs.readdirSync(entry)) walk(path.join(entry, child));
      return;
    }
    if (!/\.(md|tsx?|css|svg)$/.test(entry)) return;
    const text = fs.readFileSync(entry, "utf8");
    for (const match of text.match(/\b0\d{2,4}[\s-]?\d{3}[\s-]?\d{3,4}\b/g) ?? []) {
      const compact = match.replace(/[\s-]/g, "");
      if (!allowed.has(match) && !allowed.has(compact)) found.push(`${entry}: ${match}`);
    }
  };
  for (const root of ["app", "components", "content", "lib", "README.md"]) {
    walk(path.join(process.cwd(), root));
  }
  assert.deepEqual(found, []);
});

test("lessons are not described with the old name", () => {
  const found: string[] = [];
  const banned = new RegExp(`\\b${"lect"}ure?s?\\b`, "i");
  const walk = (entry: string) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      if (entry.endsWith("node_modules") || entry.endsWith(".next") || entry.endsWith("out")) return;
      for (const child of fs.readdirSync(entry)) walk(path.join(entry, child));
      return;
    }
    if (!/\.(md|tsx?|json)$/.test(entry)) return;
    const text = fs.readFileSync(entry, "utf8");
    if (banned.test(text)) found.push(entry);
  };
  for (const root of ["app", "components", "content", "lib", "README.md", "package.json"]) {
    walk(path.join(process.cwd(), root));
  }
  assert.deepEqual(found, []);
});
