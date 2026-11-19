# HEAL

HEAL is a small wellness site: **Health, Education, Awareness**. The lessons are written by Nkosenhle Sondezi, from Vryheid in KwaZulu-Natal. They are for ordinary weeks, and they are meant to be read on a phone.

The lessons are text files. The website builds itself from those files. You do not write code to add or change a lesson.

This is general wellness education. It is not medical advice, and it is not a crisis service. The footer points people to someone they trust, or to SADAG on 0800 567 567.

## Run it on your computer

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4187/heal/ on your computer. The site is served under `/heal`, the same path GitHub Pages uses. On a phone connected to the same Wi-Fi, use the network address the terminal prints, with `/heal/` on the end.

## Publish a copy you can host

```bash
npm run check
npm run build
```

`npm run check` reads every lesson and tells you, in plain language, if something required is missing.

`npm run build` writes the finished site into the `out` folder. The public address is https://internet-solutionist.github.io/heal/. A push to `main` builds that folder and publishes it to the `gh-pages` branch.

The build defaults to base path `/heal` and site URL `https://internet-solutionist.github.io/heal`. Those are `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` if you ever need to change them.

## How to add or edit a lesson

Lessons live in the folder `content/lessons`. Each lesson is one file ending in `.md`.

**To edit a lesson:** open its file, change the words, and save. Refresh the site if it is already running. You do not change any other file.

**To add a lesson:**

1. Find `content/lessons/_template.md`.
2. Make a copy of that file in the same folder.
3. Rename the copy. Use lowercase letters, numbers, and hyphens, and keep the `.md` ending. Example: `walking-after-lunch.md`. That name becomes the web address: `/heal/lessons/walking-after-lunch/`.
4. Open the copy. The top of the file, between the two lines that contain only `---`, is the card information. Change each line. Set `draft: no` when you want it to appear on the site. While `draft: yes`, the lesson stays hidden.
5. Under those lines, replace the example writing with the lesson. Keep the four headings that are written exactly as `## Learning goals`, `## Try this`, `## Recap`, and `## Reflection`.
6. Save the file.
7. Run `npm run check`. If it reports a problem, the message names the file and what to fix.
8. Refresh the site, or run `npm run build` again before you upload a new `out` folder.

You can do the editing on a phone if you can open the file. The check and the build still need Node.js, usually on a computer.

### What the top lines mean

| Line | What to write |
| --- | --- |
| `title` | The lesson title, in quotes. |
| `pillar` | Exactly one of these words: `health`, `education`, `awareness`. |
| `module` | The group name inside that pillar. Lessons with the same module name sit together. |
| `order` | A whole number. Lower numbers come first inside that pillar. Do not reuse a number in the same pillar. |
| `duration` | How long it takes to read, written like `8 min`. |
| `summary` | One or two sentences. This is the text on the library card. |
| `date` | The day you wrote it, written like `"2026-11-19"`. |
| `startHere` | `yes` if it should appear on the home page path. Otherwise `no`. |
| `startOrder` | Only needed when `startHere` is `yes`. `1` comes first on the home page. |
| `draft` | `yes` hides the lesson. `no` publishes it. |

There are only three pillars. Adding a fourth pillar needs a developer. Adding another lesson inside the three does not.

### How to shape the writing

Use this order:

1. `## Learning goals`, with at least two lines that start with `-`.
2. At least two sections of your own. Each one is a line like `## A heading you choose`, then a few short paragraphs.
3. `## Try this`, with one small practice.
4. `## Recap`, with at least two lines that start with `-`.
5. `## Reflection`, with two or three numbered questions.

Do not add a `#` title in the body. The title at the top of the file is enough.

Write in plain language. Do not give a diagnosis, a dose, or a promise the lesson cannot keep. If you mention help, the only helpline number used on this site is SADAG, 0800 567 567. Do not add another number unless you have checked it yourself.

### Copyable template

This is the same text as `content/lessons/_template.md`. You can copy it into a new file. Remember to rename the file, and set `draft: no` when it should be published.

```markdown
---
title: "Lesson title"
pillar: health
module: "Module name"
order: 99
duration: "8 min"
summary: "One or two plain sentences about this lesson. This line is what people see on the library card before they open it."
date: "2026-11-19"
startHere: no
draft: yes
---

## Learning goals

- Say what a reader should be able to understand or do after this lesson. Write at least two goals.
- Keep each goal to one sentence, in everyday language, with no slogan.

## First section heading

Replace this heading with the first idea of the lesson. Under it, write a few short paragraphs in plain sentences. Talk to the reader as an adult. Stay with general wellness, and do not give a diagnosis, a dose, or a promise you cannot keep.

## Second section heading

Replace this heading with the next idea. You can add more sections the same way: a line starting with ## and then the words underneath. Two sections is the minimum. Three or four is usually enough for a short lesson.

## Try this

Describe one small thing the reader can do today or this week. Keep it specific, kind, and possible in an ordinary house. One practice is enough.

## Recap

- Restate the first main point in a single line.
- Restate the second main point in a single line.
- Add any caution the reader should leave with, such as when to speak to a clinic.

## Reflection

1. Write an open question about the reader's own week. Avoid a question that has a correct answer.
2. Write a second question. A third is optional. Do not write more than three.
```

### Easy mistakes

- `pillar: Health` is fine, because capital letters are accepted. `pillar: body` is not, because `body` is not one of the three pillars.
- Two Health lessons cannot both have `order: 1`.
- A file named `Walking After Lunch.md` will be rejected. Use `walking-after-lunch.md`.
- If the lesson does not appear, check `draft`. `yes` means hidden.
- The home page path only includes lessons with `startHere: yes`.

## What the site remembers

"Mark as complete" is saved in the browser on that phone only. Clearing the browser, or opening the site in another browser, starts again. There is no login.

The breathing page is a 4-4-6 guide: four seconds in, four seconds hold, six seconds out. It is a calming exercise, not a medical device. If the phone is set to reduce motion, the circle stays still and the words change.
