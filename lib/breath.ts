export const BREATH_PHASES = [
  { id: "inhale", label: "Breathe in", seconds: 4 },
  { id: "hold", label: "Hold", seconds: 4 },
  { id: "exhale", label: "Breathe out", seconds: 6 },
] as const;

export type BreathPhaseId = (typeof BREATH_PHASES)[number]["id"];

export const CYCLE_MS = BREATH_PHASES.reduce(
  (total, phase) => total + phase.seconds * 1000,
  0,
);

export const SCALE_MIN = 0.72;
export const SCALE_MAX = 1;

export type BreathFrame = {
  phase: BreathPhaseId;
  label: string;
  round: number;
  secondsLeft: number;
  scale: number;
};

export function frameAt(elapsedMs: number): BreathFrame {
  const safe = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  const round = Math.floor(safe / CYCLE_MS) + 1;
  let cursor = safe % CYCLE_MS;

  for (const phase of BREATH_PHASES) {
    const duration = phase.seconds * 1000;
    if (cursor < duration) {
      let scale = SCALE_MAX;
      if (phase.id === "inhale") {
        scale = SCALE_MIN + (SCALE_MAX - SCALE_MIN) * (cursor / duration);
      } else if (phase.id === "exhale") {
        scale = SCALE_MAX - (SCALE_MAX - SCALE_MIN) * (cursor / duration);
      }
      return {
        phase: phase.id,
        label: phase.label,
        round,
        secondsLeft: Math.max(1, Math.ceil((duration - cursor) / 1000)),
        scale,
      };
    }
    cursor -= duration;
  }

  return {
    phase: "inhale",
    label: "Breathe in",
    round: round + 1,
    secondsLeft: 4,
    scale: SCALE_MIN,
  };
}
