import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { business, contact } from "@/content";

/** Business detail, or a visible marker that it still has to be filled in. */
export function Fill({ v }: { v: string }) {
  return v ? <>{v}</> : <mark className="rounded bg-warn/20 px-1 text-warn">[יש להשלים]</mark>;
}

export function Owner() {
  return (
    <>
      {business.name}
      {business.legalName && <> ({business.legalName}</>}
      {business.registrationId && <>, ע.מ/ח.פ {business.registrationId}</>}
      {business.legalName && <>)</>}
    </>
  );
}

export function ContactLine() {
  return (
    <>
      בדוא&quot;ל{" "}
      {contact.email ? (
        <a href={`mailto:${contact.email}`} dir="ltr">
          {contact.email}
        </a>
      ) : (
        <Fill v="" />
      )}{" "}
      או בטלפון{" "}
      <a href={`tel:${contact.phoneTel}`} dir="ltr">
        {contact.phoneDisplay}
      </a>
    </>
  );
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Nexora, לעמוד הבית">
            <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-blue via-violet to-accent font-display text-lg font-black text-white">
              N
            </span>
            <b dir="ltr" className="font-display text-[22px] font-extrabold">
              Nexora
            </b>
          </Link>
          <Link href="/" className="flex min-h-11 items-center gap-2 text-[15px] font-semibold text-muted-foreground hover:text-foreground">
            <ArrowRight aria-hidden className="size-4" />
            חזרה לאתר
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[860px] px-4 py-14 sm:px-6">
        <h1 className="font-display text-[clamp(34px,5vw,52px)] font-black">{title}</h1>
        <p className="mt-2 text-muted-foreground">עדכון אחרון: {business.policiesUpdated}</p>
        <article className="legal mt-10 grid gap-8 text-[17px] leading-[1.85] text-foreground/90">{children}</article>
      </main>
      <footer className="border-t border-white/[0.08]">
        <nav aria-label="מסמכים משפטיים" className="mx-auto flex max-w-[860px] flex-wrap gap-x-6 gap-y-2 px-4 py-8 text-[15px] font-semibold text-muted-foreground sm:px-6">
          <Link href="/privacy/" className="hover:text-foreground">מדיניות פרטיות</Link>
          <Link href="/terms/" className="hover:text-foreground">תנאי שימוש</Link>
          <Link href="/accessibility/" className="hover:text-foreground">הצהרת נגישות</Link>
          <span className="ms-auto">© 2026 Nexora</span>
        </nav>
      </footer>
    </div>
  );
}

export function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <h2 className="font-display text-2xl font-extrabold">
        <span className="text-primary">{n}.</span> {title}
      </h2>
      {children}
    </section>
  );
}
