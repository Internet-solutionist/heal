"use client";

import { BookOpen, House, ListChecks, Wind } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/mark";
import { useProgress } from "@/components/progress-provider";
import { NAV_ITEMS, isNavActive } from "@/lib/nav";
import { cn } from "cn";

const icons = {
  "/": House,
  "/library": BookOpen,
  "/breathe": Wind,
  "/progress": ListChecks,
} as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { ready, completed } = useProgress();
  const done = Object.keys(completed).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="h-1 bg-sunrise" aria-hidden="true" />
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5 rounded-full">
          <Mark className="size-9 text-primary" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.35rem] tracking-[0.14em] text-foreground">HEAL</span>
            <span className="text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">Vryheid</span>
          </span>
        </Link>
        {isNavActive(pathname, "/breathe") ? null : (
          <Link
            href="/breathe"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sunrise px-3 text-sm font-semibold text-sunrise-ink md:hidden"
          >
            <Wind className="size-4" aria-hidden="true" />
            Breathe now
          </Link>
        )}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.href);
              const Icon = icons[item.href];
              const showCount = item.href === "/progress" && ready && done > 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium",
                      active ? "bg-accent text-primary" : "text-foreground hover:bg-secondary",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                    {showCount ? (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                        {done}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
