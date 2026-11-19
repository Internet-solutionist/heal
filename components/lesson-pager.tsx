import Link from "next/link";
import { PillarName } from "@/components/pillar";
import type { LessonCard } from "@/lib/lessons";

export function LessonPager({
  previous,
  next,
}: {
  previous: LessonCard | null;
  next: LessonCard | null;
}) {
  return (
    <nav aria-label="Lesson sequence" className="mt-8 grid gap-3 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/lessons/${previous.slug}`}
          className="rounded-3xl border border-border bg-card px-5 py-4 hover:border-primary/40"
        >
          <span className="text-sm text-muted-foreground">Previous</span>
          <span className="mt-1 block font-serif text-xl leading-snug">{previous.title}</span>
          <PillarName pillar={previous.pillar} className="mt-2 text-sm" />
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/lessons/${next.slug}`}
          className="rounded-3xl border border-border bg-card px-5 py-4 hover:border-primary/40 sm:text-right"
        >
          <span className="text-sm text-muted-foreground">Next</span>
          <span className="mt-1 block font-serif text-xl leading-snug">{next.title}</span>
          <span className="mt-2 flex sm:justify-end">
            <PillarName pillar={next.pillar} className="text-sm" />
          </span>
        </Link>
      ) : (
        <Link
          href="/library"
          className="rounded-3xl border border-border bg-card px-5 py-4 font-medium text-primary hover:border-primary/40 sm:text-right"
        >
          Back to the library
        </Link>
      )}
    </nav>
  );
}
