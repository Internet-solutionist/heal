import type { Metadata } from "next";
import { BreathCircle } from "@/components/breath-circle";

export const metadata: Metadata = {
  title: "Breathe",
  description: "A guided 4-4-6 breathing circle: four seconds in, four to hold, six seconds out.",
};

export default function BreathePage() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-8">
      <p className="text-sm font-medium tracking-[0.14em] text-primary uppercase">A short reset</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">A minute of breathing</h1>
      <p className="mt-4 text-base leading-7">
        The circle grows while you breathe in, rests while you hold, and shrinks while you breathe out.
        Four seconds in, four seconds hold, six seconds out. Tap the circle to start. Tap again to pause.
      </p>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        If holding your breath feels wrong, stop. You can simply breathe out a little longer than you breathe in, with no hold.
      </p>
      <BreathCircle />
      <p className="mt-8 text-sm leading-6 text-muted-foreground">
        This is a calming exercise, not a treatment. Stop if you feel dizzy or unwell. It does not replace care from a clinic.
      </p>
    </div>
  );
}
