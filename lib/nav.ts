export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/breathe", label: "Breathe" },
  { href: "/progress", label: "Progress" },
] as const;

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isNavActive(pathname: string, href: string): boolean {
  const path = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return path === "/";
  if (target === "/library") {
    return path === "/library" || path.startsWith("/lessons");
  }
  return path === target || path.startsWith(`${target}/`);
}
