import assert from "node:assert/strict";
import test from "node:test";
import { CYCLE_MS, SCALE_MAX, SCALE_MIN, frameAt } from "./breath";

test("the 4-4-6 cycle lands on the right phase", () => {
  assert.equal(CYCLE_MS, 14000);
  assert.equal(frameAt(0).phase, "inhale");
  assert.equal(frameAt(0).secondsLeft, 4);
  assert.equal(frameAt(0).round, 1);
  assert.ok(Math.abs(frameAt(0).scale - SCALE_MIN) < 0.001);

  assert.equal(frameAt(3999).phase, "inhale");
  assert.equal(frameAt(3999).secondsLeft, 1);

  assert.equal(frameAt(4000).phase, "hold");
  assert.equal(frameAt(4000).secondsLeft, 4);
  assert.equal(frameAt(4000).scale, SCALE_MAX);

  assert.equal(frameAt(8000).phase, "exhale");
  assert.equal(frameAt(8000).secondsLeft, 6);
  assert.equal(frameAt(8000).scale, SCALE_MAX);

  assert.equal(frameAt(13999).phase, "exhale");
  assert.equal(frameAt(13999).secondsLeft, 1);
  assert.ok(frameAt(13999).scale < SCALE_MIN + 0.01);

  assert.equal(frameAt(14000).phase, "inhale");
  assert.equal(frameAt(14000).round, 2);
  assert.equal(frameAt(-20).phase, "inhale");
});
