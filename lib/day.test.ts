import assert from "node:assert/strict";
import test from "node:test";
import { lessonOfTheDay } from "./lessons";
import { completionStreak } from "./streak";

test("lesson of the day is stable for a date and wraps the list", () => {
  const items = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];
  const today = new Date(2026, 10, 19, 9, 0, 0);
  assert.equal(lessonOfTheDay(items, today)?.slug, lessonOfTheDay(items, today)?.slug);
  assert.equal(lessonOfTheDay([], today), null);
  const picked = lessonOfTheDay(items, today);
  assert.ok(picked && ["a", "b", "c"].includes(picked.slug));
});

test("a streak counts consecutive local days and survives until yesterday", () => {
  const today = new Date(2026, 10, 19, 15, 0, 0);
  const stamp = (day: number) => new Date(2026, 10, day, 15, 0, 0).toISOString();
  assert.equal(completionStreak([stamp(19)], today), 1);
  assert.equal(completionStreak([stamp(19), stamp(18), stamp(17)], today), 3);
  assert.equal(completionStreak([stamp(18)], today), 1);
  assert.equal(completionStreak([stamp(17)], today), 0);
  assert.equal(completionStreak([stamp(19), stamp(17)], today), 1);
});
