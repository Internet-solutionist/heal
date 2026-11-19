import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/library-browser";
import { getLessonCards } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Browse HEAL lessons on health, education, and awareness.",
};

export default function LibraryPage() {
  return <LibraryBrowser lessons={getLessonCards()} />;
}
