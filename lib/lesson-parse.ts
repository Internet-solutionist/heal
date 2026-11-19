import matter from "gray-matter";
import { PILLARS, PILLAR_IDS, isPillarId, type PillarId } from "./pillars";

export type LessonBlock =
  | { kind: "goals"; markdown: string }
  | { kind: "section"; title: string; markdown: string }
  | { kind: "practice"; markdown: string }
  | { kind: "recap"; markdown: string }
  | { kind: "reflection"; markdown: string };

export type Lesson = {
  slug: string;
  title: string;
  pillar: PillarId;
  module: string;
  order: number;
  duration: string;
  summary: string;
  date: string;
  dateLabel: string;
  startHere: boolean;
  startOrder: number | null;
  draft: boolean;
  blocks: LessonBlock[];
  searchText: string;
};

export type ParseResult = {
  lesson: Lesson | null;
  errors: string[];
};

const SPECIAL = {
  "learning goals": "goals",
  "try this": "practice",
  recap: "recap",
  reflection: "reflection",
} as const;

const HEADING_LABEL = {
  goals: "Learning goals",
  practice: "Try this",
  recap: "Recap",
  reflection: "Reflection",
} as const;

type SpecialKind = (typeof SPECIAL)[keyof typeof SPECIAL];

function asBool(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["yes", "true", "y"].includes(normalized)) return true;
    if (["no", "false", "n"].includes(normalized)) return false;
  }
  return null;
}

function asInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return Number(value.trim());
  }
  return null;
}

function asDateString(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "string" && isIsoDate(value.trim())) return value.trim();
  return null;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function formatLessonDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function listItems(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.+)$/)?.[1]?.trim() ?? "")
    .filter(Boolean);
}

function headingKind(title: string): SpecialKind | "section" {
  const key = title
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "");
  return SPECIAL[key as keyof typeof SPECIAL] ?? "section";
}

export function sortLessons(lessons: Lesson[]): Lesson[] {
  return [...lessons].sort((a, b) => {
    const pillar = PILLAR_IDS.indexOf(a.pillar) - PILLAR_IDS.indexOf(b.pillar);
    if (pillar !== 0) return pillar;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title, "en");
  });
}

export function parseLessonFile(
  slug: string,
  raw: string,
  options?: { template?: boolean },
): ParseResult {
  const label = options?.template ? "_template.md" : `${slug}.md`;
  const errors: string[] = [];

  if (!options?.template && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(
      `${label}: rename this file using lowercase letters, numbers, and hyphens only. For example, walking-after-lunch.md.`,
    );
  }

  const parsed = matter(raw.replace(/^\uFEFF/, ""));
  const data = parsed.data ?? {};
  const body = parsed.content ?? "";

  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) {
    errors.push(`${label}: add a title between the --- lines, like title: "A short title".`);
  } else if (title.length > 90) {
    errors.push(`${label}: the title is too long. Keep it under 90 characters.`);
  }

  const pillarRaw = typeof data.pillar === "string" ? data.pillar.trim().toLowerCase() : "";
  if (!isPillarId(pillarRaw)) {
    errors.push(
      `${label}: pillar must be one of these words: health, education, awareness.`,
    );
  }

  const moduleName = typeof data.module === "string" ? data.module.trim() : "";
  if (!moduleName) {
    errors.push(`${label}: add a module name. Lessons with the same module sit together.`);
  } else if (moduleName.length > 80) {
    errors.push(`${label}: the module name is too long.`);
  }

  const order = asInt(data.order);
  if (order === null || order < 1 || order > 99) {
    errors.push(`${label}: order must be a whole number from 1 to 99. Lower numbers come first.`);
  }

  const duration = typeof data.duration === "string" ? data.duration.trim() : "";
  if (!/^\d+\s+min$/.test(duration)) {
    errors.push(`${label}: duration should look like this: 8 min.`);
  }

  const summary = typeof data.summary === "string" ? data.summary.trim() : "";
  if (summary.length < 40 || summary.length > 240) {
    errors.push(
      `${label}: summary should be one or two sentences, between 40 and 240 characters. It is shown on the library card.`,
    );
  }

  const date = asDateString(data.date);
  if (!date) {
    errors.push(`${label}: date should look like 2026-08-03.`);
  }

  const startHere = asBool(data.startHere);
  if (startHere === null) {
    errors.push(`${label}: add startHere: yes or startHere: no.`);
  }

  let startOrder: number | null = null;
  if (startHere) {
    startOrder = asInt(data.startOrder);
    if (startOrder === null || startOrder < 1) {
      errors.push(`${label}: startHere is yes, so add startOrder: 1 (or 2, 3, and so on).`);
    }
  }

  const draft = asBool(data.draft);
  if (draft === null) {
    errors.push(`${label}: add draft: yes to hide the lesson, or draft: no to publish it.`);
  }

  if (body.split(/\r?\n/).some((line) => /^#\s+\S/.test(line))) {
    errors.push(
      `${label}: do not add a # title in the body. The title already lives at the top of the file.`,
    );
  }

  const lines = body.split(/\r?\n/);
  const chunks: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } | null = null;
  const preamble: string[] = [];

  for (const line of lines) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      current = { title: match[1].trim(), lines: [] };
      chunks.push(current);
      continue;
    }
    if (current) current.lines.push(line);
    else preamble.push(line);
  }

  if (plainText(preamble.join("\n"))) {
    errors.push(
      `${label}: move any writing that sits above the first ## heading. Each part needs a heading.`,
    );
  }

  const blocks: LessonBlock[] = [];
  const seen = new Set<SpecialKind>();

  for (const chunk of chunks) {
    const kind = headingKind(chunk.title);
    const markdown = chunk.lines.join("\n").trim();
    if (kind === "section") {
      if (plainText(markdown).length < 80) {
        errors.push(
          `${label}: the section "${chunk.title}" needs more writing under the heading.`,
        );
      }
      blocks.push({ kind: "section", title: chunk.title, markdown });
      continue;
    }
    if (seen.has(kind)) {
      errors.push(`${label}: the heading "## ${chunk.title}" appears more than once.`);
    }
    seen.add(kind);
    if (kind === "goals") {
      const items = listItems(markdown);
      if (items.length < 2) {
        errors.push(`${label}: under Learning goals, write at least two lines starting with -`);
      }
      blocks.push({ kind: "goals", markdown });
    } else if (kind === "practice") {
      if (plainText(markdown).length < 40) {
        errors.push(`${label}: under Try this, describe one small practice.`);
      }
      blocks.push({ kind: "practice", markdown });
    } else if (kind === "recap") {
      if (listItems(markdown).length < 2) {
        errors.push(`${label}: under Recap, write at least two lines starting with -`);
      }
      blocks.push({ kind: "recap", markdown });
    } else {
      const questions = listItems(markdown);
      if (questions.length < 2 || questions.length > 3) {
        errors.push(
          `${label}: under Reflection, write two or three numbered questions.`,
        );
      }
      blocks.push({ kind: "reflection", markdown });
    }
  }

  for (const kind of Object.values(SPECIAL)) {
    if (!seen.has(kind)) {
      errors.push(`${label}: add a heading on its own line: ## ${HEADING_LABEL[kind]}`);
    }
  }

  const kinds = blocks.map((block) => block.kind);
  const sectionCount = kinds.filter((kind) => kind === "section").length;
  if (sectionCount < 2) {
    errors.push(`${label}: add at least two ordinary sections. Each one starts with ## and a heading of your own.`);
  }

  const sectionsAreGrouped =
    kinds[0] === "goals" &&
    kinds.at(-3) === "practice" &&
    kinds.at(-2) === "recap" &&
    kinds.at(-1) === "reflection" &&
    kinds.slice(1, -3).every((kind) => kind === "section");

  if (seen.size === 4 && sectionCount >= 2 && !sectionsAreGrouped) {
    errors.push(
      `${label}: keep this order: Learning goals, then your sections, then Try this, Recap, and Reflection.`,
    );
  }

  if (!options?.template && draft === false) {
    if (title === "Lesson title") {
      errors.push(`${label}: replace "Lesson title" with the real title before you set draft: no.`);
    }
    if (moduleName === "Module name") {
      errors.push(`${label}: replace "Module name" with a real module before you set draft: no.`);
    }
    for (const block of blocks) {
      if (
        block.kind === "section" &&
        (block.title === "First section heading" || block.title === "Second section heading")
      ) {
        errors.push(
          `${label}: replace "${block.title}" with a real section heading before you publish.`,
        );
      }
    }
  }

  if (options?.template && draft !== true) {
    errors.push("_template.md: keep draft: yes so the blank example is not published.");
  }

  if (errors.length || !isPillarId(pillarRaw) || order === null || !date || startHere === null || draft === null) {
    return { lesson: null, errors };
  }

  const lesson: Lesson = {
    slug,
    title,
    pillar: pillarRaw,
    module: moduleName,
    order,
    duration,
    summary,
    date,
    dateLabel: formatLessonDate(date),
    startHere,
    startOrder,
    draft,
    blocks,
    searchText: [
      title,
      pillarRaw,
      PILLARS[pillarRaw].label,
      moduleName,
      summary,
      ...blocks.map((block) =>
        block.kind === "section" ? `${block.title} ${plainText(block.markdown)}` : plainText(block.markdown),
      ),
    ]
      .join(" ")
      .toLowerCase(),
  };

  return { lesson, errors: [] };
}

export function assessLibrary(lessons: Lesson[]): string[] {
  const errors: string[] = [];
  const published = lessons.filter((lesson) => !lesson.draft);
  const slugs = new Set<string>();

  for (const lesson of lessons) {
    if (slugs.has(lesson.slug)) {
      errors.push(`${lesson.slug}.md: this file name is already used.`);
    }
    slugs.add(lesson.slug);
  }

  for (const pillar of PILLAR_IDS) {
    const used = new Map<number, string>();
    for (const lesson of published.filter((item) => item.pillar === pillar)) {
      const existing = used.get(lesson.order);
      if (existing) {
        errors.push(
          `${lesson.slug}.md: order ${lesson.order} is already used by ${existing}.md in ${PILLARS[pillar].label}. Pick a different number.`,
        );
      } else {
        used.set(lesson.order, lesson.slug);
      }
    }
  }

  const starts = new Map<number, string>();
  for (const lesson of published.filter((item) => item.startHere)) {
    if (lesson.startOrder === null) continue;
    const existing = starts.get(lesson.startOrder);
    if (existing) {
      errors.push(
        `${lesson.slug}.md: startOrder ${lesson.startOrder} is already used by ${existing}.md.`,
      );
    } else {
      starts.set(lesson.startOrder, lesson.slug);
    }
  }

  return errors;
}
