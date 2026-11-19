import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { getLessonCards } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "My progress",
  description: "See which HEAL lessons you have marked complete on this phone.",
};

export default function ProgressPage() {
  return <ProgressDashboard lessons={getLessonCards()} />;
}
