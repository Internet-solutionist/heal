import Link from "next/link";
import { PillarIcon, pillarHeaderClass } from "@/components/pillar";
import { Reveal } from "@/components/reveal";
import { getLessonCards, getStartHereCards, lessonOfTheDay } from "@/lib/lessons";
import { PILLARS, PILLAR_IDS } from "@/lib/pillars";

export default function HomePage() {
  const lessons = getLessonCards();
  const startHere = getStartHereCards();
  const first = startHere[0] ?? lessons[0];
  const today = lessonOfTheDay(lessons);
  const latest = [...lessons].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-5 py-14 sm:py-20">
          <p className="rise text-sm font-semibold tracking-[0.22em] text-sunrise uppercase">
            Health · Education · Awareness
          </p>
          <h1 className="rise rise-delay mt-4 max-w-4xl font-serif text-[3.15rem] leading-[0.95] tracking-tight sm:text-7xl">
            Nine lessons for a steadier week.
          </h1>
          <p className="rise rise-delay-2 mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
            I am Nkosenhle Sondezi, writing from Vryheid. These lessons are for ordinary weeks: shifts, family duty, school runs, and the days in between. Read one on your phone. Take what helps.
          </p>
          <div className="rise rise-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={first ? `/lessons/${first.slug}` : "/library"}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-sunrise px-6 text-base font-semibold text-sunrise-ink shadow-lg"
            >
              Start your first lesson
            </Link>
            <Link
              href="/library"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary-foreground/40 px-6 text-base font-semibold text-primary-foreground"
            >
              Browse the lessons
            </Link>
          </div>
          {latest ? (
            <p className="mt-6 text-sm text-primary-foreground/75">
              {lessons.length} lessons · last updated {latest.dateLabel}
            </p>
          ) : null}
        </div>
      </section>

      {today ? (
        <section className="mx-auto w-full max-w-5xl px-5 pt-8" aria-labelledby="lesson-of-the-day">
          <Reveal>
            <Link
              href={`/lessons/${today.slug}`}
              className="card-lift block overflow-hidden rounded-3xl border border-sunrise bg-card shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 bg-sunrise px-5 py-3 text-sunrise-ink">
                <p id="lesson-of-the-day" className="text-sm font-semibold tracking-[0.16em] uppercase">
                  Lesson of the day
                </p>
                <span className="text-sm font-medium">{today.duration}</span>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm font-semibold text-primary">{PILLARS[today.pillar].label}</p>
                <p className="mt-1 font-serif text-3xl leading-tight tracking-tight">{today.title}</p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{today.summary}</p>
                <p className="mt-4 text-sm font-semibold text-education">Open this lesson</p>
              </div>
            </Link>
          </Reveal>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-5xl px-5 py-12" aria-labelledby="start-path">
        <h2 id="start-path" className="font-serif text-3xl tracking-tight sm:text-4xl">
          A short path, if you want one
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          Begin with the body, then with what stress is doing, then with the people around you. Leave the path whenever you like. The library is not a test.
        </p>
        {startHere.length === 0 ? (
          <p className="mt-6 rounded-3xl border border-dashed border-border bg-card px-5 py-6">
            No lesson is marked as a starting point yet. The library is open.
          </p>
        ) : (
          <ol className="mt-6 space-y-3">
            {startHere.map((lesson, index) => (
              <li key={lesson.slug}>
                <Reveal>
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="card-lift flex gap-4 rounded-3xl border border-border bg-card px-5 py-4"
                  >
                    <span className="font-serif text-3xl text-education" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>
                      <span className="text-sm font-semibold text-primary">{PILLARS[lesson.pillar].label}</span>
                      <span className="mt-1 block font-serif text-2xl leading-snug">{lesson.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{lesson.summary}</span>
                      <span className="mt-2 block text-sm text-muted-foreground">{lesson.duration}</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-12" aria-labelledby="pillars">
        <h2 id="pillars" className="font-serif text-3xl tracking-tight sm:text-4xl">
          Three pillars
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {PILLAR_IDS.map((pillar) => {
            const items = lessons.filter((lesson) => lesson.pillar === pillar);
            const modules = [...new Set(items.map((lesson) => lesson.module))];
            return (
              <Reveal key={pillar}>
                <article className="card-lift overflow-hidden rounded-3xl border border-border bg-card">
                  <div className={`flex items-center gap-3 px-5 py-4 text-primary-foreground ${pillarHeaderClass(pillar)}`}>
                    <span className="grid size-11 place-items-center rounded-full bg-white/15">
                      <PillarIcon pillar={pillar} className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl leading-none">{PILLARS[pillar].label}</h3>
                      <p className="mt-1 text-sm text-primary-foreground">
                        {modules.length === 1 ? modules[0] : `${items.length} lessons`}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-5">
                    <p className="text-sm leading-6 text-muted-foreground">{PILLARS[pillar].description}</p>
                    <ul className="mt-4 divide-y divide-border">
                      {items.map((lesson) => (
                        <li key={lesson.slug}>
                          <Link
                            href={`/lessons/${lesson.slug}`}
                            className="flex items-baseline justify-between gap-3 py-3"
                          >
                            <span className="font-medium">{lesson.title}</span>
                            <span className="shrink-0 text-sm text-muted-foreground">{lesson.duration}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/library?pillar=${pillar}`}
                      className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-education underline decoration-education/40 underline-offset-4"
                    >
                      Open {PILLARS[pillar].label}
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-16">
        <div className="rounded-3xl bg-secondary px-5 py-5 sm:px-6">
          <h2 className="font-serif text-2xl">Not medical advice</h2>
          <p className="mt-2 max-w-2xl text-base leading-7">
            These lessons are general wellness education. They are not a diagnosis, a treatment plan, or a substitute for care from a clinic, counsellor, or doctor. If you are unwell, speak to a health worker.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The breathing circle is four seconds in, four to hold, six out. It is a calming guide, not a treatment.
          </p>
        </div>
      </section>
    </div>
  );
}
