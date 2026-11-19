export const PROGRESS_KEY = "heal.progress.v1";
export const PENDING_SNAPSHOT = "__heal_pending__";
export const ERROR_SNAPSHOT = "__heal_error__";

export type ProgressState = {
  completed: Record<string, string>;
};

const listeners = new Set<() => void>();

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return { completed: {} };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Progress stored on this phone could not be read.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Progress stored on this phone could not be read.");
  }
  const completedRaw = (parsed as { completed?: unknown }).completed;
  if (!completedRaw || typeof completedRaw !== "object" || Array.isArray(completedRaw)) {
    throw new Error("Progress stored on this phone could not be read.");
  }
  const completed: Record<string, string> = {};
  for (const [slug, value] of Object.entries(completedRaw)) {
    if (typeof value === "string" && value.length > 0 && value.length < 80) {
      completed[slug] = value;
    }
  }
  return { completed };
}

export function serializeProgress(completed: Record<string, string>): string {
  return JSON.stringify({ completed });
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeProgress(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getProgressSnapshot(): string {
  try {
    return window.localStorage.getItem(PROGRESS_KEY) ?? "";
  } catch {
    return ERROR_SNAPSHOT;
  }
}

export function getProgressServerSnapshot(): string {
  return PENDING_SNAPSHOT;
}

export function writeProgress(completed: Record<string, string>): void {
  window.localStorage.setItem(PROGRESS_KEY, serializeProgress(completed));
  emit();
}

export function clearStoredProgress(): void {
  window.localStorage.removeItem(PROGRESS_KEY);
  emit();
}
