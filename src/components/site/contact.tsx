"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Phone, Send } from "lucide-react";
import { Aurora, Badge, Logo, Reveal } from "./primitives";
import { ClipReveal, Parallax } from "./motion";
import { business, contact, nav, needs } from "@/content";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[17px] font-medium text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow,background-color] duration-200 outline-none focus:border-primary focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgb(96_165_250/0.18)] aria-[invalid=true]:border-danger";

type Status = "idle" | "sending" | "sent" | "wa" | "error";

export function Contact() {
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; consent?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waText, setWaText] = useState("");
  const [copied, setCopied] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    // Honeypot: real visitors never see or fill this field.
    if (v("website")) return setStatus("sent");
    const next = { name: v("name").length < 2, phone: v("phone").replace(/\D/g, "").length < 9, consent: f.get("consent") !== "on" };
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.phone) return phoneRef.current?.focus();
    if (next.consent) return consentRef.current?.focus();

    const text =
      "היי Nexora, אשמח לשיחת ייעוץ.\n" +
      `שם: ${v("name")}\nטלפון: ${v("phone")}` +
      (v("biz") ? `\nעסק: ${v("biz")}` : "") +
      `\nצריך: ${v("need")}` +
      (v("msg") ? `\nהבעיה: ${v("msg")}` : "");

    if (!contact.web3formsKey) {
      setWaText(text);
      setStatus("wa");
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: contact.web3formsKey,
          subject: `פנייה חדשה מהאתר: ${v("name")}`,
          from_name: "אתר Nexora",
          "שם": v("name"),
          "טלפון": v("phone"),
          "עסק": v("biz") || "-",
          "צריך": v("need"),
          "הבעיה": v("msg") || "-",
          "הסכמה למדיניות הפרטיות": "כן",
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.success === false) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(contact.phoneDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="contact" className="relative overflow-hidden py-[clamp(80px,11vw,140px)]">
      <ClipReveal className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#151a3a,#070912_70%)]">
        <Aurora intensity={0.8} />
      </ClipReveal>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="relative mx-auto grid max-w-[1180px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal className="grid gap-6 lg:sticky lg:top-28">
          <Badge dot>בואו נדבר</Badge>
          <h2 className="font-display text-[clamp(40px,6vw,76px)] leading-[1.02] font-black tracking-tight text-balance">
            <span className="text-fade">ספרו לנו מה תוקע את העסק.</span> <span className="text-glow">נחזור עם פתרון.</span>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            שיחת ייעוץ של 20 דקות, בלי עלות ובלי התחייבות. בסופה תדעו מה כדאי לבנות ואיך זה יעבוד אצלכם.
          </p>
          <div className="glass flex flex-wrap items-center gap-4 rounded-2xl p-5">
            <span className="grid size-12 place-items-center rounded-full bg-accent/15 text-accent">
              <Phone aria-hidden className="size-5" />
            </span>
            <div className="grid">
              <small className="text-sm text-muted-foreground">מעדיפים לדבר עכשיו?</small>
              <a href={`tel:${contact.phoneTel}`} dir="ltr" className="text-end font-display text-[28px] leading-tight font-extrabold">
                {contact.phoneDisplay}
              </a>
            </div>
            <button
              type="button"
              onClick={copyPhone}
              className="ms-auto min-h-11 cursor-pointer rounded-full border border-white/15 px-4 text-[15px] font-bold transition-colors hover:border-white/40"
            >
              {copied ? "הועתק" : "העתקת המספר"}
            </button>
          </div>
          <ul className="grid gap-2.5 font-semibold">
            {["חוזרים אליכם באותו יום עסקים", "הצעה כתובה תוך 48 שעות", "אם אנחנו לא הכתובת, נגיד לכם"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check aria-hidden className="size-5 shrink-0 text-ok" strokeWidth={2.8} />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            noValidate
            onSubmit={onSubmit}
            className="glass beam relative grid gap-4 rounded-3xl bg-[#0a0e19]/70 p-[clamp(22px,3vw,36px)] shadow-[0_40px_120px_-30px_rgb(139_92_246/0.45)]"
          >
            <h3 className="font-display text-[28px] font-black">השאירו פרטים ונחזור אליכם</h3>
            <p className="-mt-2 text-base text-muted-foreground">ממלאים דקה, ואנחנו מתקשרים לתאם שיחת ייעוץ.</p>

            {status === "sent" || status === "wa" ? (
              <div role="status" className="grid gap-3 rounded-2xl border border-ok/30 bg-ok/10 p-5">
                {status === "sent" ? (
                  <>
                    <b className="text-lg">תודה, קיבלנו את הפנייה.</b>
                    <span>נחזור אליכם עוד היום לתיאום שיחת ייעוץ.</span>
                  </>
                ) : (
                  <>
                    <b className="text-lg">הפרטים מוכנים.</b>
                    {contact.whatsappNumber ? (
                      <a
                        className="font-extrabold text-ok underline"
                        href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(waText)}`}
                        target="_blank"
                        rel="noopener"
                      >
                        לחצו כדי לשלוח לנו אותם בוואטסאפ
                      </a>
                    ) : (
                      <span className="text-muted-foreground">(מצב הדגמה: הטופס עדיין לא מחובר לתיבת דוא&quot;ל.)</span>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label htmlFor="f-name" className="text-[15px] font-bold">שם מלא</label>
                    <input ref={nameRef} id="f-name" name="name" autoComplete="name" placeholder="ישראל ישראלי" required aria-invalid={!!errors.name} aria-describedby="e-name" className={field} />
                    {errors.name && <span id="e-name" className="text-sm font-semibold text-danger">נא למלא שם</span>}
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="f-phone" className="text-[15px] font-bold">טלפון</label>
                    <input ref={phoneRef} id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="050-0000000" dir="ltr" required aria-invalid={!!errors.phone} aria-describedby="e-phone" className={cn(field, "text-right")} />
                    {errors.phone && <span id="e-phone" className="text-sm font-semibold text-danger">נא למלא מספר טלפון תקין</span>}
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="f-biz" className="text-[15px] font-bold">שם העסק ותחום</label>
                  <input id="f-biz" name="biz" placeholder="למשל: סטודיו לפילאטיס בחיפה" className={field} />
                </div>
                <fieldset className="grid gap-2">
                  <legend className="mb-1.5 text-[15px] font-bold">מה אתם צריכים?</legend>
                  <div className="flex flex-wrap gap-2">
                    {needs.map((n, i) => (
                      <label key={n} className="cursor-pointer">
                        <input type="radio" name="need" value={n} defaultChecked={i === 0} className="peer sr-only" />
                        <span className="block rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[15px] font-semibold text-muted-foreground transition-colors peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-primary hover:border-white/30">
                          {n}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="grid gap-1.5">
                  <label htmlFor="f-msg" className="text-[15px] font-bold">ספרו בקצרה מה הבעיה</label>
                  <textarea id="f-msg" name="msg" rows={3} placeholder="למשל: אני מתאם את כל התורים בוואטסאפ ולקוחות שוכחים להגיע" className={cn(field, "min-h-24 resize-y")} />
                </div>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -start-[9999px] size-px opacity-0" />
                <div className="grid gap-1.5">
                  <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed">
                    <input
                      ref={consentRef}
                      type="checkbox"
                      name="consent"
                      required
                      aria-invalid={!!errors.consent}
                      aria-describedby="consent-note e-consent"
                      className="mt-1 size-5 shrink-0 cursor-pointer accent-[var(--blue)]"
                    />
                    <span>
                      קראתי ואני מסכים/ה ל
                      <Link href="/privacy/" target="_blank" className="font-bold text-primary underline underline-offset-2">
                        מדיניות הפרטיות
                      </Link>
                    </span>
                  </label>
                  {errors.consent && <span id="e-consent" className="text-sm font-semibold text-danger">כדי לשלוח צריך לאשר את מדיניות הפרטיות</span>}
                  <p id="consent-note" className="text-[13px] leading-relaxed text-muted-foreground">
                    הפרטים ישמשו רק כדי לחזור אליכם ולהכין הצעה. אין חובה חוקית למסור אותם, אבל בלי שם וטלפון לא נוכל לחזור אליכם. הפרטים
                    מועברים לתיבת הדוא&quot;ל שלנו דרך שירות Web3Forms, ואפשר לבקש לעיין בהם, לתקן או למחוק אותם בכל עת.
                  </p>
                </div>
                {status === "error" && <p role="alert" className="text-sm font-semibold text-danger">השליחה לא עברה. נסו שוב או התקשרו אלינו.</p>}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="shimmer mt-1 inline-flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-[17px] font-bold text-on-accent shadow-[0_10px_40px_-8px_rgb(249_115_22/0.7)] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending" ? <Loader2 aria-hidden className="size-[18px] animate-spin" /> : <Send aria-hidden className="size-[18px] -scale-x-100" />}
                  {status === "sending" ? "שולחים..." : "שליחת פנייה"}
                </button>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function MobileBar() {
  const [away, setAway] = useState(false);
  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAway(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 grid grid-cols-2 gap-2 rounded-full p-1.5 transition-transform duration-300 sm:hidden",
        "glass bg-[#0a0e19]/80 shadow-[0_20px_50px_-10px_rgb(0_0_0/0.9)]",
        away && "translate-y-[150%]",
      )}
    >
      <a href={`tel:${contact.phoneTel}`} className="grid min-h-12 place-items-center rounded-full font-bold">
        התקשרו
      </a>
      <a href="#contact" className="grid min-h-12 place-items-center rounded-full bg-accent font-bold text-on-accent">
        השאירו פרטים
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] pb-24 sm:pb-0">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
        <Logo />
        <nav aria-label="ניווט תחתון" className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-muted-foreground">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <span className="text-[15px] text-muted-foreground">© 2026 Nexora</span>
      </div>
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/[0.06] px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <span>
          {business.legalName ? business.legalName : business.name}
          {business.registrationId && <> · ע.מ/ח.פ {business.registrationId}</>}
          {business.address && <> · {business.address}</>}
          {contact.email && (
            <>
              {" · "}
              <a href={`mailto:${contact.email}`} dir="ltr" className="hover:text-foreground">
                {contact.email}
              </a>
            </>
          )}
        </span>
        <nav aria-label="מסמכים משפטיים" className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <Link href="/privacy/" className="hover:text-foreground">מדיניות פרטיות</Link>
          <Link href="/terms/" className="hover:text-foreground">תנאי שימוש</Link>
          <Link href="/accessibility/" className="hover:text-foreground">הצהרת נגישות</Link>
        </nav>
      </div>
      <Parallax offset={50}>
      <div
        aria-hidden
        className="pointer-events-none -mb-[0.22em] text-center font-display text-[clamp(80px,19vw,300px)] leading-none font-black tracking-tight select-none bg-linear-to-b from-white/15 to-transparent to-85% bg-clip-text text-transparent"
      >
        Nexora
      </div>
      </Parallax>
    </footer>
  );
}
