"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { PillarName } from "@/components/pillar";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LessonCard } from "@/lib/lessons";
import { PILLARS, PILLAR_IDS, isPillarId, type PillarId } from "@/lib/pillars";
import { cn } from "cn";

const PENDING = "__pending__";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener("heal-library", listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("heal-library", listener);
  };
}

function readPillar(search: string): PillarId | "all" {
  const value = new URLSearchParams(search).get("pillar");
  return value && isPillarId(value) ? value : "all";
}

function writePillar(next: PillarId | "all") {
  const url = new URL(window.location.href);
  if (next === "all") url.searchParams.delete("pillar");
  else url.searchParams.set("pillar", next);
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  window.dispatchEvent(new Event("heal-library"));
}

export function LibraryBrowser({ lessons }: { lessons: LessonCard[] }) {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => PENDING);
  const ready = search !== PENDING;
  const pillar = ready ? readPillar(search) : "all";
  const { ready: progressReady, isComplete } = useProgress();
  const [query, setQuery] = useQueryState();
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filtered = lessons.filter((lesson) => {
    if (pillar !== "all" && lesson.pillar !== pillar) return false;
    return words.every((word) => lesson.searchText.includes(word));
  });

  const grouped = pillar === "all" && words.length === 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8">
      <p className="text-sm font-medium tracking-[0.14em] text-primary uppercase">Library</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Lessons</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        {lessons.length} short lessons, grouped under Health, Education, and Awareness. Filter by pillar, or search for a word.
      </p>

      <div className="mt-6">
        <label htmlFor="lesson-search" className="text-sm font-medium">
          Search lessons
        </label>
        <Input
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sleep, stress, burnout…"
          className="mt-2"
          autoComplete="off"
        />
      </div>

      <div role="group" aria-label="Filter by pillar" className="mt-4 flex flex-wrap gap-2">
        <FilterButton pressed={pillar === "all"} onClick={() => writePillar("all")} disabled={!ready}>
          All
        </FilterButton>
        {PILLAR_IDS.map((id) => (
          <FilterButton key={id} pressed={pillar === id} onClick={() => writePillar(id)} disabled={!ready}>
            {PILLARS[id].label}
          </FilterButton>
        ))}
      </div>

      {!ready ? (
        <p className="mt-8 text-base text-muted-foreground" role="status">
          Opening the library…
        </p>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-5 py-8" role="status">
          <p className="font-serif text-2xl">Nothing matches that.</p>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            Try a different word, or clear the filter. The lessons are still here.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => {
              setQuery("");
              writePillar("all");
            }}
          >
            Clear search and filter
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground" role="status">
            {filtered.length === 1 ? "1 lesson" : `${filtered.length} lessons`}
          </p>
          {grouped ? (
            <div className="mt-4 space-y-10">
              {PILLAR_IDS.map((id) => {
                const items = filtered.filter((lesson) => lesson.pillar === id);
                if (items.length === 0) return null;
                return (
                  <section key={id} aria-labelledby={`pillar-${id}`}>
                    <h2 id={`pillar-${id}`} className="font-serif text-3xl tracking-tight">
                      <PillarName pillar={id} />
                    </h2>
                    <ModuleGroups
                      lessons={items}
                      progressReady={progressReady}
                      isComplete={isComplete}
                    />
                  </section>
                );
              })}
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {filtered.map((lesson) => (
                <li key={lesson.slug}>
                  <LessonCardView
                    lesson={lesson}
                    done={progressReady && isComplete(lesson.slug)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function useQueryState(): [string, (value: string) => void] {
  const query = useSyncExternalStore(subscribeQuery, getQuerySnapshot, () => "");
  return [query, setQuerySnapshot];
}

const queryListeners = new Set<() => void>();
let queryValue = "";

function subscribeQuery(listener: () => void) {
  queryListeners.add(listener);
  return () => queryListeners.delete(listener);
}

function getQuerySnapshot() {
  return queryValue;
}

function setQuerySnapshot(value: string) {
  queryValue = value;
  for (const listener of queryListeners) listener();
}

function FilterButton({
  pressed,
  onClick,
  disabled,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={pressed ? "default" : "outline"}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ModuleGroups({
  lessons,
  progressReady,
  isComplete,
}: {
  lessons: LessonCard[];
  progressReady: boolean;
  isComplete: (slug: string) => boolean;
}) {
  const modules: { name: string; items: LessonCard[] }[] = [];
  for (const lesson of lessons) {
    const existing = modules.find((module) => module.name === lesson.module);
    if (existing) existing.items.push(lesson);
    else modules.push({ name: lesson.module, items: [lesson] });
  }

  return (
    <div className="mt-4 space-y-6">
      {modules.map((module) => (
        <div key={module.name}>
          <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {module.name}
          </h3>
          <ul className="mt-3 space-y-3">
            {module.items.map((lesson) => (
              <li key={lesson.slug}>
                <LessonCardView lesson={lesson} done={progressReady && isComplete(lesson.slug)} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LessonCardView({ lesson, done }: { lesson: LessonCard; done: boolean }) {
  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className={cn(
        "card-lift block rounded-3xl border border-border bg-card px-5 py-4",
        done && "bg-accent",
      )}
    >
      <span className="flex flex-wrap items-center justify-between gap-2">
        <PillarName pillar={lesson.pillar} className="text-sm" />
        <span className="text-sm text-muted-foreground">{done ? "Completed" : lesson.duration}</span>
      </span>
      <span className="mt-2 block font-serif text-2xl leading-snug tracking-tight">{lesson.title}</span>
      <span className="mt-2 block text-sm leading-6 text-muted-foreground">{lesson.summary}</span>
    </Link>
  );
}
