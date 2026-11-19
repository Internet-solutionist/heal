"use client";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";

export function CompleteButton({ slug, title }: { slug: string; title: string }) {
  const { ready, error, isComplete, toggle } = useProgress();
  const done = isComplete(slug);

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card px-5 py-5">
      <p className="text-sm leading-6 text-muted-foreground">
        Saved only on this phone, in this browser. Nothing is sent anywhere.
      </p>
      <Button
        type="button"
        className="mt-4 w-full"
        variant={done ? "secondary" : "default"}
        aria-pressed={done}
        aria-busy={!ready}
        disabled={!ready}
        onClick={() => toggle(slug)}
      >
        {done ? "Marked complete" : "Mark as complete"}
      </Button>
      {done ? (
        <p className="mt-3 text-sm leading-6">Tap again if you want to mark “{title}” as not complete.</p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm leading-6 text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
