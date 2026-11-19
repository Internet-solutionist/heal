import { HeartPulse, Lightbulb, Users, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { PILLARS, type PillarId } from "@/lib/pillars";

const textTone: Record<PillarId, string> = {
  health: "text-health",
  education: "text-education",
  awareness: "text-awareness",
};

const dotTone: Record<PillarId, string> = {
  health: "bg-health",
  education: "bg-education",
  awareness: "bg-awareness",
};

const headerTone: Record<PillarId, string> = {
  health: "bg-health",
  education: "bg-education",
  awareness: "bg-awareness",
};

const icons: Record<PillarId, LucideIcon> = {
  health: HeartPulse,
  education: Lightbulb,
  awareness: Users,
};

export function PillarIcon({ pillar, className }: { pillar: PillarId; className?: string }) {
  const Icon = icons[pillar];
  return <Icon className={className} aria-hidden="true" />;
}

export function PillarName({
  pillar,
  className,
}: {
  pillar: PillarId;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-medium", textTone[pillar], className)}>
      <span className={cn("size-2 shrink-0 rounded-full", dotTone[pillar])} aria-hidden="true" />
      {PILLARS[pillar].label}
    </span>
  );
}

export function pillarHeaderClass(pillar: PillarId): string {
  return headerTone[pillar];
}
