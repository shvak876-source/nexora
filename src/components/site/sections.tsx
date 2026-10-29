"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { AppWindow, ArrowLeft, BarChart3, Check, Eye, KeyRound, Lock, MessageCircle, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Aurora, GlowCard, Reveal, SectionHead } from "./primitives";
import { HorizontalScroll, StackCards, Tilt } from "./motion";
import { commitments, faq, monthly, services, steps, tickets } from "@/content";
import { cn } from "@/lib/utils";
import { useReduced } from "@/lib/a11y";

const wrap = "mx-auto max-w-[1180px] px-4 sm:px-6";
const section = "relative py-[clamp(80px,11vw,140px)]";

/* ---------------- Services bento ---------------- */

function CardText({ icon: Icon, title, text, points }: { icon: typeof AppWindow; title: string; text: string; points?: readonly string[] }) {
  return (
    <div className="relative grid content-start gap-3">
      <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-primary">
        <Icon aria-hidden className="size-5" />
      </span>
      <h3 className="font-display text-[26px] font-extrabold sm:text-[30px]">{title}</h3>
      <p className="max-w-[46ch] text-muted-foreground">{text}</p>
      {points && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm font-semibold">
              <Check aria-hidden className="size-3.5 text-ok" strokeWidth={3} />
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BrowserVisual() {
  return (
    <div aria-hidden className="relative mt-8 overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#0a0e19]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.08] px-3 py-2.5">
        <i className="size-2 rounded-full bg-white/15" />
        <i className="size-2 rounded-full bg-white/15" />
        <i className="size-2 rounded-full bg-white/15" />
        <span className="mx-auto h-4 w-40 rounded bg-white/[0.06]" />
      </div>
      <div className="grid gap-3 p-5">
        <span className="h-3 w-24 rounded bg-primary/40" />
        <span className="h-6 w-3/4 rounded bg-white/15" />
        <span className="h-6 w-1/2 rounded bg-white/10" />
        <div className="mt-2 flex gap-2">
          <span className="h-8 w-28 rounded-full bg-accent/80 shadow-[0_0_24px_-4px_var(--accent)]" />
          <span className="h-8 w-24 rounded-full border border-white/15" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-16 rounded-xl border border-white/[0.08] bg-white/[0.03]" />
          ))}
        </div>
      </div>
      <div className="glass absolute end-4 bottom-4 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold [animation:float_5s_ease-in-out_infinite]">
        <span className="size-2 rounded-full bg-ok [animation:pulse-ring_1.8s_ease-out_infinite]" />
        פנייה חדשה מהאתר
      </div>
    </div>
  );
}

function PhoneVisual() {
  return (
    <div aria-hidden className="relative mx-auto mt-8 h-[300px] w-[180px] rounded-t-[34px] border-[6px] border-b-0 border-white/10 bg-[#0a0e19] p-3">
      <span className="mx-auto block h-4 w-16 rounded-full bg-white/10" />
      <div className="glass mt-4 rounded-2xl p-3 text-start [animation:float_5s_ease-in-out_infinite]">
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="grid size-5 place-items-center rounded-md bg-gradient-to-br from-blue to-violet text-[10px] text-white">N</span>
          מבצע לחברי המועדון
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">20% הנחה על ההזמנה הבאה</p>
      </div>
      <div className="mt-3 grid gap-2">
        <span className="h-14 rounded-xl bg-white/[0.05]" />
        <span className="h-14 rounded-xl bg-white/[0.05]" />
      </div>
      <span className="mt-3 block h-9 rounded-full bg-accent/85 shadow-[0_0_24px_-4px_var(--accent)]" />
    </div>
  );
}

function ChartVisual() {
  const reduced = useReduced();
  return (
    <div aria-hidden className="mt-6 flex h-28 items-end gap-2">
      {[30, 55, 42, 70, 58, 88, 76, 100].map((h, i) => (
        <motion.span
          key={i}
          className={cn("flex-1 origin-bottom rounded-t-md", i === 7 ? "bg-gradient-to-t from-blue to-cyan shadow-[0_0_20px_-2px_var(--cyan)]" : "bg-white/10")}
          style={{ height: `${h}%` }}
          initial={reduced ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

function ChatVisual() {
  const reduced = useReduced();
  const msgs = [
    { me: false, t: "היי שירן, תזכורת לתור מחר ב־13:15 💅" },
    { me: true, t: "מגיעה, תודה!" },
    { me: false, t: "מעולה, התור אושר ✓" },
  ];
  return (
    <div aria-hidden className="mt-6 grid gap-2">
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          className={cn(
            "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
            m.me ? "justify-self-end rounded-be-sm bg-white/[0.07]" : "justify-self-start rounded-bs-sm bg-ok/20 text-emerald-100",
          )}
          initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.45 }}
        >
          {m.t}
        </motion.div>
      ))}
    </div>
  );
}

export function Services() {
  const [web, app, system] = services;
  return (
    <section id="services" className={section}>
      <div className={wrap}>
        <SectionHead
          badge="מה אנחנו בונים"
          title="שלושה תחומים. *עסק* *אחד* *שמחובר.*"
          text="אפשר להתחיל מאחד ולהוסיף בהמשך. האתר מכניס פניות, המערכת מנהלת אותן והאפליקציה שומרת את הלקוחות קרובים."
        />
        <div className="grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <Tilt className="h-full">
            <GlowCard beam className="h-full px-7 pt-7 sm:px-9 sm:pt-9">
              <CardText icon={AppWindow} title={web.title} text={web.text} points={web.points} />
              <BrowserVisual />
            </GlowCard>
            </Tilt>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.08}>
            <Tilt className="h-full">
            <GlowCard className="h-full px-7 pt-7">
              <CardText icon={Smartphone} title={app.title} text={app.text} />
              <PhoneVisual />
            </GlowCard>
            </Tilt>
          </Reveal>
          <Reveal className="md:col-span-3">
            <Tilt className="h-full">
            <GlowCard className="h-full p-7 sm:p-9">
              <CardText icon={BarChart3} title={system.title} text={system.text} />
              <ChartVisual />
            </GlowCard>
            </Tilt>
          </Reveal>
          <Reveal className="md:col-span-3" delay={0.08}>
            <Tilt className="h-full">
            <GlowCard className="h-full p-7 sm:p-9">
              <CardText icon={MessageCircle} title="אוטומציות וואטסאפ" text="תזכורות, אישורי הגעה והודעות ללקוחות יוצאים לבד, בזמן הנכון." />
              <ChatVisual />
            </GlowCard>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Problem picker ---------------- */

export function ProblemPicker() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReduced();
  const t = tickets[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + tickets.length) % tickets.length;
    tabs.current[n]?.focus();
    setActive(n);
  };

  return (
    <section id="solve" className={section}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[400px] max-w-3xl rounded-full bg-blue/20 blur-[120px]" />
      <div className={cn(wrap, "relative")}>
        <SectionHead
          badge="מתחילים מהבעיה"
          title="מה *תוקע* אתכם היום?"
          text="בחרו את המשפט שהכי מתאים לעסק שלכם, ותראו מה היינו בונים וכמה זמן זה לוקח."
        />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
          <div role="tablist" aria-label="בעיות נפוצות בעסקים" aria-orientation="vertical" className="grid gap-3">
            {tickets.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${i}`}
                  aria-selected={on}
                  aria-controls="ticket"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "glass relative flex min-h-[72px] cursor-pointer items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 text-start text-[17px] leading-snug font-semibold transition-colors duration-200 sm:text-lg",
                    on ? "border-white/25" : "text-muted-foreground hover:border-white/20 hover:text-foreground",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="problem-glow"
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-l from-blue/30 via-violet/20 to-transparent"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative grid size-9 shrink-0 place-items-center rounded-full border font-mono text-sm",
                      on ? "border-primary bg-primary/15 text-primary shadow-[0_0_20px_-4px_var(--primary)]" : "border-white/15",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="relative flex-1">{p.problem}</span>
                  <ArrowLeft aria-hidden className={cn("relative size-5 shrink-0 transition-opacity", on ? "opacity-100" : "opacity-0")} />
                </button>
              );
            })}
          </div>

          <article
            id="ticket"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            aria-live="polite"
            className="glass beam overflow-hidden rounded-3xl lg:sticky lg:top-28"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-7 py-4 text-[13px] text-muted-foreground">
              <span className="font-semibold">מה נבנה לכם</span>
              <span className="font-mono">{t.id}</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={t.id}
                className="grid gap-5 p-7"
                initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-[clamp(28px,3.2vw,38px)] leading-tight font-black">{t.title}</h3>
                <p className="text-muted-foreground">{t.sol}</p>
                <ul className="grid gap-2.5">
                  {t.list.map((x) => (
                    <li key={x} className="flex items-start gap-3">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
                        <Check aria-hidden className="size-3" strokeWidth={3.5} />
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            <dl className="grid grid-cols-2 border-t border-white/[0.08]">
              <div className="grid gap-0.5 border-e border-white/[0.08] px-7 py-5">
                <dt className="text-[13px] text-muted-foreground">זמן עבודה</dt>
                <dd className="text-xl font-extrabold">{t.time}</dd>
              </div>
              <div className="grid gap-0.5 px-7 py-5">
                <dt className="text-[13px] text-muted-foreground">אחרי העלייה</dt>
                <dd className="text-xl font-extrabold">ליווי חודשי</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process: sideways pinned scroll on desktop, glowing timeline on mobile ---------------- */

function StepCard({ s, i }: { s: (typeof steps)[number]; i: number }) {
  return (
    <GlowCard className="relative h-full p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 end-4 font-display text-[150px] leading-none font-black text-white/[0.04] select-none"
      >
        {i + 1}
      </span>
      <span className="grid size-14 place-items-center rounded-full border border-white/15 bg-background font-display text-xl font-black text-primary shadow-[0_0_30px_-6px_var(--blue)]">
        {i + 1}
      </span>
      <span className="mt-6 block text-sm font-bold text-primary">{s.when}</span>
      <h3 className="mt-1 font-display text-[28px] font-extrabold">{s.title}</h3>
      <p className="mt-3 text-[17px] text-muted-foreground">{s.text}</p>
    </GlowCard>
  );
}

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <section id="process" className="relative pt-[clamp(80px,11vw,140px)] lg:pb-0">
      <div className={wrap}>
        <SectionHead
          badge="איך זה עובד"
          title="מהשיחה הראשונה *ועד* *שזה* *עובד*"
          text="ארבעה שלבים, בלי הפתעות. בכל שלב אתם יודעים איפה הפרויקט עומד ומה הצעד הבא."
          className="lg:mb-0"
        />
      </div>

      <div className="hidden lg:block">
        <HorizontalScroll>
          {steps.map((s, i) => (
            <div key={s.title} className="w-[440px] shrink-0">
              <StepCard s={s} i={i} />
            </div>
          ))}
          <div className="grid w-[440px] shrink-0 content-center gap-5 rounded-3xl border border-dashed border-white/15 p-8">
            <h3 className="font-display text-[30px] leading-tight font-black">
              הצעד הראשון <span className="text-glow">לוקח 20 דקות.</span>
            </h3>
            <p className="text-muted-foreground">שיחת ייעוץ בלי עלות ובלי התחייבות.</p>
            <a href="#contact" className="shimmer inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-accent px-6 font-bold text-on-accent">
              לקביעת שיחה
              <ArrowLeft aria-hidden className="size-[18px]" />
            </a>
          </div>
        </HorizontalScroll>
      </div>

      <div className={cn(wrap, "pb-[clamp(80px,11vw,140px)] lg:hidden")}>
        <ol ref={ref} className="relative grid gap-6">
          <span aria-hidden className="absolute inset-y-0 start-[27px] w-px bg-white/10" />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute inset-y-0 start-[27px] w-px origin-top bg-gradient-to-b from-cyan via-violet to-accent shadow-[0_0_14px_1px_var(--violet)]"
          />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} className="relative grid grid-cols-[56px_1fr] gap-5">
              <span className="relative z-10 grid size-14 place-items-center rounded-full border border-white/15 bg-background font-display text-xl font-black text-primary shadow-[0_0_30px_-6px_var(--blue)]">
                {i + 1}
              </span>
              <GlowCard className="p-6">
                <span className="text-sm font-bold text-primary">{s.when}</span>
                <h3 className="mt-1 font-display text-2xl font-extrabold">{s.title}</h3>
                <p className="mt-2 text-[17px] text-muted-foreground">{s.text}</p>
              </GlowCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Promise: commitments as stacking cards + monthly care ---------------- */

const commitIcons = { lock: Lock, key: KeyRound, eye: Eye, refresh: RefreshCw, chat: MessageCircle, shield: ShieldCheck };

export function Promise() {
  return (
    <section className={section}>
      <div className={wrap}>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHead
            align="start"
            className="mb-0 lg:sticky lg:top-32"
            badge="למה אנחנו"
            title="מתחייבים *בכתב.*"
            text="כל אחד מהדברים האלה נכנס להצעה שאתם חותמים עליה."
          />
          <StackCards
            items={commitments.map((c, i) => {
              const Icon = commitIcons[c.icon];
              return (
                <div
                  key={c.title}
                  className="relative flex min-h-[200px] items-start gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-7 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.9)] sm:p-9"
                >
                  <div aria-hidden className="pointer-events-none absolute -end-20 -top-20 size-60 rounded-full bg-violet/15 blur-[60px]" />
                  <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue/30 to-violet/30 text-primary ring-1 ring-white/10">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <div className="relative">
                    <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                    <h3 className="mt-1 font-display text-2xl font-extrabold sm:text-[28px]">{c.title}</h3>
                    <p className="mt-2 text-[17px] text-muted-foreground">{c.text}</p>
                  </div>
                </div>
              );
            })}
          />
        </div>
        <Reveal className="mt-16">
          <div className="glass beam relative overflow-hidden rounded-3xl p-8 sm:p-10">
            <Aurora intensity={0.35} />
            <div className="relative grid items-center gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
              <h3 className="font-display text-[30px] font-black">מה כולל הליווי החודשי?</h3>
              <ul className="flex flex-wrap gap-2.5">
                {monthly.map((m) => (
                  <li key={m} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[15px] font-semibold">
                    <Check aria-hidden className="size-4 text-ok" strokeWidth={3} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function Faq() {
  return (
    <section id="faq" className={section}>
      <div className={cn(wrap, "max-w-[900px]")}>
        <SectionHead badge="שאלות נפוצות" title="מה ששואלים לפני שמתחילים" />
        <Reveal>
          {/* 21st.dev spring accordion, restyled for the brand */}
          <Accordion
            items={faq.map((f) => ({ ...f, content: <p>{f.content}</p> }))}
            defaultOpen={["tech"]}
            maxPanelHeight={400}
            className="w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
