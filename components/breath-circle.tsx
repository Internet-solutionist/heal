"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BREATH_PHASES,
  SCALE_MIN,
  frameAt,
  type BreathFrame,
} from "@/lib/breath";

export function BreathCircle() {
  const circleRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const anchorRef = useRef(0);
  const phaseKeyRef = useRef("");
  const reducedRef = useRef(false);
  const runningRef = useRef(false);
  const [running, setRunning] = useState(false);
  const [hasBegun, setHasBegun] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [frame, setFrame] = useState<BreathFrame>(() => frameAt(0));
  const [live, setLive] = useState(
    "Ready. Breathe in for 4 seconds, hold for 4, then breathe out for 6.",
  );

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
      if (media.matches && circleRef.current) {
        circleRef.current.style.transform = "scale(0.86)";
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!running) return;
    anchorRef.current = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = elapsedRef.current + (performance.now() - anchorRef.current);
      const next = frameAt(elapsed);
      if (circleRef.current) {
        circleRef.current.style.transform = reducedRef.current
          ? "scale(0.86)"
          : `scale(${next.scale})`;
      }
      const phaseKey = `${next.phase}-${next.round}`;
      if (phaseKey !== phaseKeyRef.current) {
        phaseKeyRef.current = phaseKey;
        const seconds = next.phase === "exhale" ? 6 : 4;
        setLive(`${next.label} for ${seconds} seconds. Round ${next.round}.`);
      }
      setFrame((current) =>
        current.phase === next.phase &&
        current.secondsLeft === next.secondsLeft &&
        current.round === next.round
          ? current
          : next,
      );
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [running]);

  const pause = useCallback(() => {
    if (!runningRef.current) return;
    elapsedRef.current += performance.now() - anchorRef.current;
    phaseKeyRef.current = "";
    setRunning(false);
    setLive("Paused. Tap the circle when you want to continue.");
  }, []);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [pause]);

  const startOrPause = () => {
    if (runningRef.current) {
      pause();
      return;
    }
    setHasBegun(true);
    setRunning(true);
  };

  const reset = () => {
    elapsedRef.current = 0;
    phaseKeyRef.current = "";
    setRunning(false);
    setHasBegun(false);
    setFrame(frameAt(0));
    setLive("Ready. Breathe in for 4 seconds, hold for 4, then breathe out for 6.");
    if (circleRef.current) {
      circleRef.current.style.transform = reducedRef.current ? "scale(0.86)" : `scale(${SCALE_MIN})`;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex min-h-[22rem] flex-col items-center justify-center">
        <button
          type="button"
          onClick={startOrPause}
          aria-pressed={running}
          aria-label={running ? "Pause the breathing exercise" : "Start the breathing exercise"}
          className="relative grid size-[min(78vw,18rem)] place-items-center rounded-full touch-manipulation"
        >
          <span
            ref={circleRef}
            aria-hidden="true"
            className="absolute inset-4 rounded-full bg-primary/15 ring-2 ring-primary/50"
            style={{ transform: `scale(${reduced ? 0.86 : SCALE_MIN})` }}
          />
          <span className="relative px-6 text-center" aria-hidden="true">
            <span className="block font-serif text-3xl leading-tight tracking-tight">
              {hasBegun ? frame.label : "Tap to start"}
            </span>
            {hasBegun ? (
              <span className="mt-2 block font-serif text-5xl tabular-nums">{frame.secondsLeft}</span>
            ) : (
              <span className="mt-2 block text-sm text-muted-foreground">4 in · 4 hold · 6 out</span>
            )}
          </span>
        </button>
        <p className="sr-only" aria-live="polite">
          {live}
        </p>
      </div>

      <ol className="mt-2 flex justify-center gap-4 text-sm" aria-hidden="true">
        {BREATH_PHASES.map((phase) => (
          <li
            key={phase.id}
            className={
              hasBegun && frame.phase === phase.id ? "font-semibold text-primary" : "text-muted-foreground"
            }
          >
            {phase.label} {phase.seconds}s
          </li>
        ))}
      </ol>

      {hasBegun ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">Round {frame.round}</p>
      ) : null}

      {frame.round >= 5 ? (
        <p className="mx-auto mt-4 max-w-sm text-center text-base leading-7">
          Four rounds is enough for a reset. Stay with it if you want, or stop here.
        </p>
      ) : null}

      {reduced ? (
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-muted-foreground">
          Reduced motion is on, so the circle stays still. The words and the count still change.
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button type="button" onClick={startOrPause} className="sm:min-w-36">
          {running ? "Pause" : hasBegun ? "Continue" : "Start"}
        </Button>
        <Button type="button" variant="outline" onClick={reset} disabled={!hasBegun}>
          Reset
        </Button>
      </div>
    </div>
  );
}
