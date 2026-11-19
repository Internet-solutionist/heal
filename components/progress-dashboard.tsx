"use client";

import Link from "next/link";
import { PillarName } from "@/components/pillar";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { LessonCard } from "@/lib/lessons";
import { PILLARS, PILLAR_IDS, type PillarId } from "@/lib/pillars";
import { completionStreak } from "@/lib/streak";
import { cn } from "cn";

export function ProgressDashboard({ lessons }: { lessons: LessonCard[] }) {
  const { ready, error, completed, isComplete, toggle, clear } = useProgress();
  const doneCount = lessons.filter((lesson) => isComplete(lesson.slug)).length;
  const nextLesson = lessons.find((lesson) => !isComplete(lesson.slug));
  const streak = completionStreak(Object.values(completed));
  const pillarDone = (pillar: PillarId) => {
    const items = lessons.filter((lesson) => lesson.pillar === pillar);
    return items.length > 0 && items.every((lesson) => isComplete(lesson.slug));
  };
  const badges = [
    { id: "first", label: "First lesson", earned: doneCount >= 1 },
    { id: "pillar", label: "Full pillar", earned: PILLAR_IDS.some(pillarDone) },
    { id: "streak", label: "Three-day streak", earned: streak >= 3 },
    { id: "all", label: "All lessons", earned: lessons.length > 0 && doneCount === lessons.length },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      <p className="text-sm font-semibold tracking-[0.16em] text-education uppercase">On this phone</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">My progress</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Completion marks stay in this browser. They are not an account, and they are not sent anywhere.
      </p>

      {!ready ? (
        <p className="mt-8 text-base" role="status">
          Checking this phone…
        </p>
      ) : (
        <>
          {error ? (
            <p className="mt-6 rounded-2xl border border-destructive/30 bg-card px-4 py-3 text-sm leading-6 text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <section className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,16rem)_1fr]" aria-labelledby="streak-heading">
            <div className="rounded-3xl bg-primary px-6 py-5 text-primary-foreground">
              <p id="streak-heading" className="text-sm font-semibold tracking-[0.14em] text-sunrise uppercase">
                Day streak
              </p>
              <p className="mt-1 font-serif text-6xl leading-none">{streak}</p>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/85">
                {streak === 0
                  ? "Mark a lesson today to start a streak."
                  : streak === 1
                    ? "One day counts. Come back tomorrow to keep it."
                    : `${streak} days in a row with at least one lesson marked.`}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card px-5 py-5">
              <h2 className="font-serif text-3xl tracking-tight">
                {doneCount} of {lessons.length}
              </h2>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                {doneCount === 0
                  ? "Nothing is marked yet. Open any lesson and, when you have read it, tap Mark as complete."
                  : doneCount === lessons.length
                    ? "You have marked every current lesson complete. You can read any of them again."
                    : "Keep going from wherever you left off, or choose a different lesson."}
              </p>
              {nextLesson ? (
                <Button
                  nativeButton={false}
                  render={<Link href={`/lessons/${nextLesson.slug}`} />}
                  className="mt-4 bg-sunrise text-sunrise-ink hover:bg-sunrise/90"
                >
                  {doneCount === 0 ? "Start your first lesson" : "Continue"}
                </Button>
              ) : null}
            </div>
          </section>

          <section className="mt-6" aria-labelledby="badges">
            <h2 id="badges" className="font-serif text-2xl">
              Badges
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <li
                  key={badge.id}
                  className={cn(
                    "rounded-2xl border px-4 py-4",
                    badge.earned
                      ? "border-transparent bg-sunrise text-sunrise-ink"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                    {badge.earned ? "Earned" : "Ahead"}
                  </span>
                  <span className="mt-1 block font-serif text-xl leading-tight">{badge.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8" aria-labelledby="by-pillar">
            <h2 id="by-pillar" className="font-serif text-2xl">
              By pillar
            </h2>
            <ul className="mt-4 space-y-4">
              {PILLAR_IDS.map((pillar) => {
                const items = lessons.filter((lesson) => lesson.pillar === pillar);
                const done = items.filter((lesson) => isComplete(lesson.slug)).length;
                const width = items.length === 0 ? 0 : Math.round((done / items.length) * 100);
                return (
                  <li key={pillar} className="rounded-3xl border border-border bg-card px-5 py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <PillarName pillar={pillar} />
                      <span className="text-sm text-muted-foreground">
                        {done} of {items.length}
                        {pillarDone(pillar) ? " · Badge" : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{PILLARS[pillar].description}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                      <div className="h-full rounded-full bg-education" style={{ width: `${width}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-8" aria-labelledby="lesson-list">
            <h2 id="lesson-list" className="font-serif text-2xl">
              Lessons
            </h2>
            <ul className="mt-2 divide-y divide-border">
              {lessons.map((lesson) => {
                const done = isComplete(lesson.slug);
                return (
                  <li key={lesson.slug} className="flex items-start gap-3 py-4">
                    <label className="flex min-h-12 min-w-12 items-center justify-center">
                      <input
                        type="checkbox"
                        className="size-6 accent-primary"
                        checked={done}
                        onChange={() => toggle(lesson.slug)}
                      />
                      <span className="sr-only">
                        {done ? `Mark ${lesson.title} as not complete` : `Mark ${lesson.title} as complete`}
                      </span>
                    </label>
                    <div className="min-w-0 pt-2">
                      <Link href={`/lessons/${lesson.slug}`} className="font-serif text-xl leading-snug">
                        {lesson.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {PILLARS[lesson.pillar].label} · {lesson.duration}
                        {done ? " · Completed" : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <Dialog>
            <DialogTrigger
              render={<Button variant="outline" className="mt-6 w-full sm:w-auto" />}
              disabled={!ready || doneCount === 0}
            >
              Clear progress on this phone
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear progress?</DialogTitle>
                <DialogDescription>
                  This removes the completion marks stored on this phone, including the streak and badges. The lessons stay as they are.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Keep progress</DialogClose>
                <DialogClose render={<Button variant="destructive" onClick={clear} />}>
                  Clear progress
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <p className="sr-only" aria-live="polite">
            {ready ? `${doneCount} of ${lessons.length} lessons marked complete. Streak ${streak}.` : "Checking progress."}
          </p>
        </>
      )}
    </div>
  );
}
