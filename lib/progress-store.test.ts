import assert from "node:assert/strict";
import test from "node:test";
import { parseProgress, serializeProgress } from "./progress-store";

test("progress round-trips and ignores junk", () => {
  const raw = serializeProgress({ "sleep-that-holds-you": "2026-11-19T10:00:00.000Z" });
  assert.deepEqual(parseProgress(raw).completed, {
    "sleep-that-holds-you": "2026-11-19T10:00:00.000Z",
  });
  assert.deepEqual(parseProgress(null).completed, {});
  assert.throws(() => parseProgress("{"));
  assert.deepEqual(parseProgress(JSON.stringify({ completed: { ok: "yes", bad: 4 } })).completed, {
    ok: "yes",
  });
});
