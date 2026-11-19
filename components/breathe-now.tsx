"use client";

import { Wind } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";

export function BreatheNow() {
  const pathname = usePathname();
  if (isNavActive(pathname, "/breathe")) return null;

  return (
    <Link
      href="/breathe"
      className="breathe-now fixed right-4 bottom-6 z-[45] hidden min-h-12 items-center gap-2 rounded-full bg-sunrise px-4 text-sm font-semibold text-sunrise-ink shadow-lg md:inline-flex"
    >
      <Wind className="size-4" aria-hidden="true" />
      Breathe now
    </Link>
  );
}
