"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Bell, Check, CreditCard, TrendingUp } from "lucide-react";
import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { Aurora, Badge, CtaButton, Logo, NumberTicker, Reveal } from "./primitives";
import { Magnetic, VelocityRow } from "./motion";
import { nav, stats, tech, ticker } from "@/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-[1080px] items-center justify-between gap-5 rounded-full px-4 py-2.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5",
          scrolled ? "glass shadow-[0_10px_40px_-10px_rgb(0_0_0/0.8)]" : "border border-transparent",
        )}
      >
        <Logo />
        <nav aria-label="ניווט ראשי" className="hidden gap-1 lg:flex">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-[15px] font-semibold text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <CtaButton href="#contact" arrow={false} className="hidden min-h-10 px-5 py-2 text-[15px] sm:inline-flex sm:text-[15px]">
          לשיחת ייעוץ
        </CtaButton>
      </div>
    </header>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "start 25%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.9, 1]);
  const { scrollY } = useScroll();
  const copyY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -110]);
  const copyOpacity = useTransform(scrollY, [0, 500], [1, reduced ? 1 : 0.15]);
  const auroraScale = useTransform(scrollY, [0, 800], [1, reduced ? 1 : 1.35]);
  const enter = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden pt-36 pb-10 sm:pt-44">
      <motion.div aria-hidden style={{ scale: auroraScale }} className="pointer-events-none absolute inset-x-0 top-0 h-[900px] origin-top">
        <Aurora />
      </motion.div>
      {/* 21st.dev Interactive Grid: cells light up under the pointer */}
      <InteractiveGrid
        cellSize={56}
        className="h-[900px] text-white [mask-image:radial-gradient(ellipse_60%_55%_at_50%_30%,white_10%,transparent_70%)]"
      />
      {/* top spotlight cone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] [background:radial-gradient(ellipse_45%_60%_at_50%_-10%,rgb(147_197_253/0.22),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-[1180px] justify-items-center px-4 text-center sm:px-6">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="grid justify-items-center">
        <motion.div {...enter(0)}>
          <Badge dot>אתרים · אפליקציות · מערכות ניהול לעסקים</Badge>
        </motion.div>
        <motion.h1
          {...enter(1)}
          className="mt-7 font-display text-[clamp(48px,9vw,120px)] leading-[0.98] font-black tracking-[-0.03em]"
        >
          <span className="text-fade block">יש בעיה בעסק?</span>
          <span className="text-glow block pb-2">בונים לה פתרון.</span>
        </motion.h1>
        <motion.p {...enter(2)} className="mt-7 max-w-[56ch] text-lg text-muted-foreground sm:text-xl">
          אתם מספרים לנו מה תוקע את העסק. אנחנו בונים בדיוק את מה שצריך, מעלים לאוויר ונשארים איתכם עם ליווי חודשי. בלי שפה טכנית
          ובלי הפתעות.
        </motion.p>
        <motion.div {...enter(3)} className="mt-9 flex flex-wrap justify-center gap-3.5">
          <Magnetic>
            <CtaButton href="#contact">לשיחת ייעוץ חינם</CtaButton>
          </Magnetic>
          <CtaButton href="#services" variant="glass" arrow={false}>
            מה אנחנו בונים
          </CtaButton>
        </motion.div>
        <motion.ul {...enter(4)} className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] font-semibold text-muted-foreground">
          {["שיחת ייעוץ ללא עלות", "הצעה כתובה לפני שמתחילים", "עדכון התקדמות כל שבוע"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check aria-hidden className="size-4 text-ok" strokeWidth={3} />
              {t}
            </li>
          ))}
        </motion.ul>
        </motion.div>

        {/* product stage: tilts flat as it scrolls into view */}
        <div ref={stage} className="relative mt-20 w-full max-w-[980px] [perspective:1400px]">
          <div aria-hidden className="absolute inset-x-[10%] -top-10 h-40 rounded-full bg-violet/40 blur-[90px]" />
          <motion.div style={{ rotateX, scale, transformOrigin: "50% 0%" }} className="relative">
            <DashboardMock />
            <FloatingChip className="-end-6 top-16 hidden md:flex" delay={0} icon={<Bell className="size-4" />} tone="ok">
              תזכורת נשלחה בוואטסאפ לשירן
            </FloatingChip>
            <FloatingChip className="-start-8 top-1/2 hidden md:flex" delay={1.2} icon={<CreditCard className="size-4" />} tone="blue">
              תשלום התקבל · ₪450
            </FloatingChip>
            <FloatingChip className="-bottom-6 end-[18%] hidden md:flex" delay={2.4} icon={<TrendingUp className="size-4" />} tone="violet">
              ‎+18% תורים השבוע
            </FloatingChip>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingChip({
  children,
  icon,
  className,
  delay,
  tone,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  delay: number;
  tone: "ok" | "blue" | "violet";
}) {
  const toneCls = { ok: "bg-ok/20 text-ok", blue: "bg-blue/20 text-primary", violet: "bg-violet/25 text-violet-300" }[tone];
  return (
    <div
      aria-hidden
      className={cn(
        "glass absolute z-10 items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap shadow-[0_20px_50px_-15px_rgb(0_0_0/0.9)]",
        className,
      )}
      style={{ animation: `float 5s ease-in-out ${delay}s infinite` }}
    >
      <span className={cn("grid size-7 place-items-center rounded-full", toneCls)}>{icon}</span>
      {children}
    </div>
  );
}

const bars = [42, 64, 52, 80, 96, 38, 14];
const days = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const rows = [
  { t: "09:30", who: "מיכל אברהם", what: "טיפול פנים", ok: true },
  { t: "11:00", who: "נועה לוי", what: "מניקור ג׳ל", ok: true },
  { t: "13:15", who: "שירן כהן", what: "הסרת שיער", ok: false },
];

function DashboardMock() {
  return (
    <div
      role="img"
      aria-label="הדגמה של מערכת ניהול תורים ולקוחות שאנחנו בונים לעסקים"
      className="beam overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0e19]/90 text-start text-sm shadow-[0_40px_120px_-30px_rgb(59_130_246/0.45)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
        <i className="size-2.5 rounded-full bg-white/15" />
        <i className="size-2.5 rounded-full bg-white/15" />
        <i className="size-2.5 rounded-full bg-white/15" />
        <span className="mx-auto rounded-md bg-white/[0.05] px-3 py-1 font-mono text-xs text-muted-foreground" dir="ltr">
          admin.studio-dana.co.il
        </span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs font-semibold text-muted-foreground">הדגמה</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[200px_1fr] sm:p-5">
        <aside className="hidden flex-col gap-1 sm:flex">
          {["לוח בקרה", "יומן תורים", "לקוחות", "תשלומים", "תזכורות", "דוחות"].map((x, i) => (
            <span
              key={x}
              className={cn("rounded-lg px-3 py-2 font-semibold", i === 0 ? "bg-blue/15 text-primary" : "text-muted-foreground")}
            >
              {x}
            </span>
          ))}
        </aside>
        <div className="grid min-w-0 gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-extrabold">סטודיו דנה · לוח בקרה</h3>
            <span className="text-xs text-muted-foreground">השבוע</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {[
              ["תורים השבוע", "64", "+18%"],
              ["הכנסות החודש", "₪23,480", "+9%"],
              ["ביטולים", "2", "−6"],
            ].map(([k, v, d], i) => (
              <div key={k} className={cn("grid min-w-0 gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5", i === 2 && "hidden sm:grid")}>
                <small className="truncate text-xs text-muted-foreground">{k}</small>
                <b className="font-mono text-xl font-medium tabular-nums">{v}</b>
                <em className="text-xs font-bold text-ok not-italic">{d}</em>
              </div>
            ))}
          </div>
          <div className="grid gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
            <div className="grid h-28 grid-cols-7 items-end gap-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-t-md rounded-b-sm",
                    i === 4 ? "bg-gradient-to-t from-blue to-cyan shadow-[0_0_20px_-2px_var(--cyan)]" : "bg-white/10",
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-muted-foreground">
              {days.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            {rows.map((row) => (
              <div key={row.t} className="grid grid-cols-[48px_1fr_auto] items-center gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2">
                <time className="font-mono text-[13px] text-muted-foreground">{row.t}</time>
                <span className="truncate font-semibold">
                  {row.who} <span className="font-normal text-muted-foreground">· {row.what}</span>
                </span>
                <b className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", row.ok ? "bg-ok/15 text-ok" : "bg-warn/15 text-warn")}>
                  {row.ok ? "אישרה" : "ממתין"}
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex shrink-0 gap-3 pe-3">
      {items.map((t) => (
        <li key={t} className="glass rounded-full px-5 py-2.5 text-[15px] font-semibold whitespace-nowrap text-foreground/85 sm:text-base">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <section aria-label="מה אנחנו בונים ועם מה" className="relative py-14">
      <Reveal className="mb-7 text-center text-sm font-semibold tracking-wide text-muted-foreground">
        מה אנחנו בונים, ועם אילו כלים
      </Reveal>
      <div className="grid gap-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <VelocityRow baseVelocity={2}>
          <Pills items={ticker} />
        </VelocityRow>
        <VelocityRow baseVelocity={-2.4}>
          <Pills items={tech} />
        </VelocityRow>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="relative mx-auto max-w-[1180px] px-4 pb-8 sm:px-6">
      <div className="glass grid grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={cn(
              "grid gap-1 px-6 py-8 text-center",
              i % 2 === 1 && "border-s border-white/[0.08]",
              i >= 2 && "border-t border-white/[0.08] lg:border-t-0",
              i === 2 && "lg:border-s",
            )}
          >
            <b className="text-glow font-display text-[clamp(44px,6vw,68px)] leading-none font-black">
              <NumberTicker value={s.value} suffix={s.suffix} />
            </b>
            <span className="text-[15px] font-semibold text-muted-foreground">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
