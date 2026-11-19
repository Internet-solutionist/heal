"use client";

import { BookOpen, House, ListChecks, Wind } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/components/progress-provider";
import { NAV_ITEMS, isNavActive } from "@/lib/nav";
import { cn } from "cn";

const icons = {
  "/": House,
  "/library": BookOpen,
  "/breathe": Wind,
  "/progress": ListChecks,
} as const;

export function MobileNav() {
  const pathname = usePathname();
  const { ready, completed } = useProgress();
  const done = Object.keys(completed).length;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
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
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {showCount ? (
                    <span className="absolute -top-1.5 -right-3 rounded-full bg-primary px-1 text-[0.65rem] leading-4 text-primary-foreground">
                      {done}
                    </span>
                  ) : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
