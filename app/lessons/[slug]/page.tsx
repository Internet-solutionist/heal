import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteButton } from "@/components/complete-button";
import { LessonBody } from "@/components/lesson-body";
import { LessonPager } from "@/components/lesson-pager";
import { PillarName } from "@/components/pillar";
import { ReadingProgress } from "@/components/reading-progress";
import { getLessonContext, getPublishedLessons } from "@/lib/lessons";

export function generateStaticParams() {
  return getPublishedLessons().map((lesson) => ({ slug: lesson.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const context = getLessonContext(slug);
  if (!context) return { title: "Lesson" };
  return {
    title: context.lesson.title,
    description: context.lesson.summary,
    openGraph: {
      title: context.lesson.title,
      description: context.lesson.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: context.lesson.title,
      description: context.lesson.summary,
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const context = getLessonContext(slug);
  if (!context) notFound();
  const { lesson, previous, next, position, total } = context;

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto w-full max-w-2xl px-5 py-8">
        <p>
          <Link href="/library" className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4">
            Library
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <PillarName pillar={lesson.pillar} className="text-sm" />
          <span>{lesson.module}</span>
          <span>{lesson.duration}</span>
          <span>{lesson.dateLabel}</span>
        </div>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{lesson.title}</h1>
        <p className="mt-4 text-lg leading-8">{lesson.summary}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Lesson {position} of {total} · General wellness education, not medical advice.
        </p>
        <LessonBody blocks={lesson.blocks} />
        <CompleteButton slug={lesson.slug} title={lesson.title} />
        <LessonPager previous={previous} next={next} />
      </article>
    </>
  );
}
