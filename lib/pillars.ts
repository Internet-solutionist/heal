export const PILLAR_IDS = ["health", "education", "awareness"] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

export const PILLARS: Record<
  PillarId,
  { label: string; description: string }
> = {
  health: {
    label: "Health",
    description:
      "Sleep, movement, food, and breathing. Care for the body you actually live in.",
  },
  education: {
    label: "Education",
    description:
      "What stress, feelings, habits, and attention are doing, explained without jargon.",
  },
  awareness: {
    label: "Awareness",
    description:
      "Mental health, burnout, asking for help, and the ordinary work of community.",
  },
};

export function isPillarId(value: string): value is PillarId {
  return (PILLAR_IDS as readonly string[]).includes(value);
}
