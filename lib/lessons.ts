import fs from "node:fs";
import path from "node:path";
import {
  assessLibrary,
  parseLessonFile,
  sortLessons,
  type Lesson,
} from "./lesson-parse";

export type LessonCard = {
  slug: string;
  title: string;
  pillar: Lesson["pillar"];
  module: string;
  order: number;
  duration: string;
  summary: string;
  date: string;
  dateLabel: string;
  searchText: string;
  position: number;
  total: number;
  startHere: boolean;
  startOrder: number | null;
};

export type LibraryLoad = {
  published: Lesson[];
  drafts: Lesson[];
  errors: string[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "lessons");

export function loadLessonDirectory(dir = CONTENT_DIR): LibraryLoad {
  const errors: string[] = [];
  if (!fs.existsSync(dir)) {
    return { published: [], drafts: [], errors: ["The folder content/lessons is missing."] };
  }

  const templatePath = path.join(dir, "_template.md");
  if (!fs.existsSync(templatePath)) {
    errors.push("content/lessons/_template.md is missing. Keep that file so new lessons have a pattern to copy.");
  } else {
    const template = parseLessonFile(
      "_template",
      fs.readFileSync(templatePath, "utf8"),
      { template: true },
    );
    errors.push(...template.errors);
  }

  const lessons: Lesson[] = [];
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const slug = file.slice(0, -3);
    const result = parseLessonFile(slug, fs.readFileSync(path.join(dir, file), "utf8"));
    errors.push(...result.errors);
    if (result.lesson) lessons.push(result.lesson);
  }

  errors.push(...assessLibrary(lessons));
  const published = sortLessons(lessons.filter((lesson) => !lesson.draft));
  const drafts = sortLessons(lessons.filter((lesson) => lesson.draft));
  return { published, drafts, errors };
}

function assertValid(loaded: LibraryLoad): Lesson[] {
  if (loaded.errors.length > 0) {
    throw new Error(`Lesson files need a correction:\n${loaded.errors.join("\n")}`);
  }
  return loaded.published;
}

export function getPublishedLessons(): Lesson[] {
  return assertValid(loadLessonDirectory());
}

export function toCard(lesson: Lesson, position: number, total: number): LessonCard {
  return {
    slug: lesson.slug,
    title: lesson.title,
    pillar: lesson.pillar,
    module: lesson.module,
    order: lesson.order,
    duration: lesson.duration,
    summary: lesson.summary,
    date: lesson.date,
    dateLabel: lesson.dateLabel,
    searchText: lesson.searchText,
    position,
    total,
    startHere: lesson.startHere,
    startOrder: lesson.startOrder,
  };
}

export function getLessonCards(): LessonCard[] {
  const lessons = getPublishedLessons();
  return lessons.map((lesson, index) => toCard(lesson, index + 1, lessons.length));
}

export function getStartHereCards(): LessonCard[] {
  return getLessonCards()
    .filter((lesson) => lesson.startHere)
    .sort((a, b) => (a.startOrder ?? 0) - (b.startOrder ?? 0));
}

export function lessonOfTheDay<T>(lessons: T[], today = new Date()): T | null {
  if (lessons.length === 0) return null;
  const start = new Date(today.getFullYear(), 0, 0);
  const day = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  const index = ((day % lessons.length) + lessons.length) % lessons.length;
  return lessons[index] ?? null;
}

export function getLesson(slug: string): Lesson | null {
  return getPublishedLessons().find((lesson) => lesson.slug === slug) ?? null;
}

export function getLessonContext(slug: string): {
  lesson: Lesson;
  previous: LessonCard | null;
  next: LessonCard | null;
  position: number;
  total: number;
} | null {
  const lessons = getPublishedLessons();
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;
  const total = lessons.length;
  return {
    lesson: lessons[index],
    previous: index > 0 ? toCard(lessons[index - 1], index, total) : null,
    next: index < total - 1 ? toCard(lessons[index + 1], index + 2, total) : null,
    position: index + 1,
    total,
  };
}
