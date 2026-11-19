export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-5xl px-5 pt-8 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-24">
        <p className="max-w-xl font-serif text-xl leading-snug text-foreground">
          If things feel heavy, talk to someone you trust, or SADAG on{" "}
          <a href="tel:0800567567" className="underline decoration-primary/40 underline-offset-4">
            0800 567 567
          </a>
          .
        </p>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          HEAL is general wellness education from Nkosenhle Sondezi in Vryheid, KwaZulu-Natal.
          These pages are not medical advice, a diagnosis, or a substitute for a clinic, counsellor, or doctor.
        </p>
        <p className="mt-6 text-sm text-foreground">Health, Education, Awareness</p>
      </div>
    </footer>
  );
}
