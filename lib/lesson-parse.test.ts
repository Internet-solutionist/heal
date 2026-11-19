import assert from "node:assert/strict";
import test from "node:test";
import { parseLessonFile } from "./lesson-parse";

const valid = `---
title: "A useful hour"
pillar: health
module: "The body you live in"
order: 4
duration: "6 min"
summary: "A short lesson used only to prove that a complete file is accepted by the checker."
date: "2026-11-01"
startHere: no
draft: yes
---

## Learning goals

- Understand that a complete file has every required heading.
- Notice that ordinary sections sit between the goals and the practice.

## What this section is for

This paragraph is long enough to count as a real section. It explains one idea in plain language and then stops, which is what a lesson section should do.

## What the next section adds

This second paragraph is also long enough. It adds a second idea so the lesson is not a single block of text with nowhere to rest.

## Try this

Do one small thing today and notice what happens, without turning it into a project.

## Recap

- The file needs the special headings.
- The sections need real writing.

## Reflection

1. What would you change first?
2. Who could you tell?
`;

test("a complete lesson file is accepted", () => {
  const result = parseLessonFile("a-useful-hour", valid);
  assert.deepEqual(result.errors, []);
  assert.equal(result.lesson?.title, "A useful hour");
  assert.equal(result.lesson?.draft, true);
  assert.equal(result.lesson?.dateLabel, "1 November 2026");
});

test("a missing practice is explained in plain language", () => {
  const broken = valid.replace("## Try this\n\nDo one small thing today and notice what happens, without turning it into a project.\n\n", "");
  const result = parseLessonFile("a-useful-hour", broken);
  assert.equal(result.lesson, null);
  assert.ok(result.errors.some((error) => error.includes("## Try this")));
});
