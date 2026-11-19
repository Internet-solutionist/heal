import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16">
      <p className="text-sm font-medium tracking-[0.14em] text-primary uppercase">Missing page</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">That page is not here.</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        The lesson may have been renamed, or the address was typed with a slip. The library still has the full set.
      </p>
      <Link href="/library" className={cn(buttonVariants(), "mt-6")}>
        Go to the library
      </Link>
    </div>
  );
}
