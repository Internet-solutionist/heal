/** Public path prefix. GitHub Pages serves this project at /heal. */
export function siteBasePath(): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "/heal").replace(/\/$/, "");
}

/** Canonical site address, including the /heal prefix. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://internet-solutionist.github.io/heal"
  );
}

/** Prefix an in-site absolute path for raw links that Next.js does not rewrite. */
export function withBasePath(href: string): string {
  const base = siteBasePath();
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (!base || href === base || href.startsWith(`${base}/`)) return href;
  return `${base}${href}`;
}
