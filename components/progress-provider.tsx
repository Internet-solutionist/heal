"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import {
  ERROR_SNAPSHOT,
  PENDING_SNAPSHOT,
  clearStoredProgress,
  getProgressServerSnapshot,
  getProgressSnapshot,
  parseProgress,
  subscribeProgress,
  writeProgress,
} from "@/lib/progress-store";

type ProgressContextValue = {
  ready: boolean;
  error: string | null;
  completed: Record<string, string>;
  isComplete: (slug: string) => boolean;
  toggle: (slug: string) => void;
  clear: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressServerSnapshot);
  const [actionError, setActionError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (raw === PENDING_SNAPSHOT) {
      return { ready: false, error: null as string | null, completed: {} as Record<string, string> };
    }
    if (raw === ERROR_SNAPSHOT) {
      return {
        ready: true,
        error: "Progress could not be read on this phone.",
        completed: {} as Record<string, string>,
      };
    }
    try {
      return { ready: true, error: null as string | null, completed: parseProgress(raw || null).completed };
    } catch (caught) {
      return {
        ready: true,
        error: caught instanceof Error ? caught.message : "Progress could not be read on this phone.",
        completed: {} as Record<string, string>,
      };
    }
  }, [raw]);

  const toggle = (slug: string) => {
    try {
      const snapshot = getProgressSnapshot();
      if (snapshot === ERROR_SNAPSHOT) {
        throw new Error("Progress could not be read on this phone.");
      }
      const next = { ...parseProgress(snapshot || null).completed };
      if (next[slug]) delete next[slug];
      else next[slug] = new Date().toISOString();
      writeProgress(next);
      setActionError(null);
    } catch (caught) {
      setActionError(
        caught instanceof Error ? caught.message : "Progress could not be saved on this phone.",
      );
    }
  };

  const clear = () => {
    try {
      clearStoredProgress();
      setActionError(null);
    } catch {
      setActionError("Progress could not be cleared on this phone.");
    }
  };

  const value: ProgressContextValue = {
    ready: parsed.ready,
    error: actionError ?? parsed.error,
    completed: parsed.completed,
    isComplete: (slug) => Boolean(parsed.completed[slug]),
    toggle,
    clear,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return value;
}
