import { Markdown } from "@/components/markdown";
import type { LessonBlock } from "@/lib/lesson-parse";

export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="mt-8 space-y-8">
      {blocks.map((block, index) => {
        if (block.kind === "goals") {
          return (
            <section key={index} aria-labelledby="learning-goals" className="rounded-3xl bg-secondary px-5 py-5">
              <h2 id="learning-goals" className="font-serif text-2xl tracking-tight">
                Learning goals
              </h2>
              <div className="mt-3">
                <Markdown markdown={block.markdown} />
              </div>
            </section>
          );
        }
        if (block.kind === "section") {
          const id = `section-${index}`;
          return (
            <section key={index} aria-labelledby={id} className="scroll-mt-24">
              <h2 id={id} className="font-serif text-[1.7rem] leading-tight tracking-tight">
                {block.title}
              </h2>
              <div className="mt-3">
                <Markdown markdown={block.markdown} />
              </div>
            </section>
          );
        }
        if (block.kind === "practice") {
          return (
            <section
              key={index}
              aria-labelledby="try-this"
              className="rounded-3xl border border-primary/20 bg-accent px-5 py-5"
            >
              <h2 id="try-this" className="font-serif text-2xl tracking-tight text-primary">
                Try this
              </h2>
              <div className="mt-3">
                <Markdown markdown={block.markdown} />
              </div>
            </section>
          );
        }
        if (block.kind === "recap") {
          return (
            <section key={index} aria-labelledby="recap">
              <h2 id="recap" className="font-serif text-2xl tracking-tight">
                Recap
              </h2>
              <div className="mt-3">
                <Markdown markdown={block.markdown} />
              </div>
            </section>
          );
        }
        return (
          <section key={index} aria-labelledby="reflection" className="rounded-3xl border border-border bg-card px-5 py-5">
            <h2 id="reflection" className="font-serif text-2xl tracking-tight">
              Reflection
            </h2>
            <div className="mt-3">
              <Markdown markdown={block.markdown} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
